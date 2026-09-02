/*
  A minimal Chrome DevTools Protocol client.

  Why this exists rather than `new WebSocket(...)`: the global WebSocket only
  landed in Node 21, and this repo builds on Node 20 (see package.json
  `engines`). Rather than make the image-sizes workflow need a second Node,
  the ~90 lines below speak enough of RFC 6455 to talk to Chrome — which is
  very little, because a CDP connection is a plaintext ws:// socket on
  localhost that never negotiates extensions or compression.

  Not a general-purpose WebSocket client. It handles exactly what Chrome
  sends: unmasked text frames (possibly fragmented, possibly with 64-bit
  lengths, possibly split across TCP reads) plus ping/close.
*/
import net from "node:net";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

export function findChrome() {
  const fromEnv = process.env.CHROME_PATH;
  if (fromEnv) {
    if (!existsSync(fromEnv)) throw new Error(`CHROME_PATH is set but does not exist: ${fromEnv}`);
    return fromEnv;
  }
  const found = CHROME_PATHS.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      "Could not find Chrome. Set CHROME_PATH to the executable, e.g.\n" +
        "  CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run images:sizes",
    );
  }
  return found;
}

/** Frames one client->server text message. Client frames MUST be masked. */
function encodeTextFrame(text) {
  const payload = Buffer.from(text, "utf8");
  const mask = crypto.randomBytes(4);
  let header;
  if (payload.length < 126) {
    header = Buffer.from([0x81, 0x80 | payload.length]);
  } else if (payload.length < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81; header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81; header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  const masked = Buffer.allocUnsafe(payload.length);
  for (let i = 0; i < payload.length; i++) masked[i] = payload[i] ^ mask[i % 4];
  return Buffer.concat([header, mask, masked]);
}

export async function connectCDP(wsUrl) {
  const { hostname, port, pathname, search } = new URL(wsUrl);
  const key = crypto.randomBytes(16).toString("base64");
  const socket = net.connect({ host: hostname, port: Number(port) });
  socket.setNoDelay(true);
  await new Promise((res, rej) => { socket.once("connect", res); socket.once("error", rej); });

  socket.write(
    `GET ${pathname}${search} HTTP/1.1\r\nHost: ${hostname}:${port}\r\n` +
      `Upgrade: websocket\r\nConnection: Upgrade\r\n` +
      `Sec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`,
  );

  let buf = Buffer.alloc(0);
  // Wait for the end of the handshake response, keeping any bytes that follow.
  await new Promise((res, rej) => {
    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      const end = buf.indexOf("\r\n\r\n");
      if (end === -1) return;
      const head = buf.subarray(0, end).toString("latin1");
      socket.off("data", onData);
      if (!/^HTTP\/1\.1 101/.test(head)) return rej(new Error(`Upgrade refused:\n${head}`));
      buf = buf.subarray(end + 4);
      res();
    };
    socket.on("data", onData);
    socket.once("error", rej);
  });

  const pending = new Map();
  const listeners = [];
  let fragOpcode = 0;
  let fragParts = [];

  const handleMessage = (text) => {
    let msg; try { msg = JSON.parse(text); } catch { return; }
    if (msg.id !== undefined && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else for (const fn of listeners) fn(msg);
  };

  socket.on("data", (chunk) => {
    buf = Buffer.concat([buf, chunk]);
    // Drain every complete frame currently buffered.
    for (;;) {
      if (buf.length < 2) return;
      const fin = (buf[0] & 0x80) !== 0;
      const opcode = buf[0] & 0x0f;
      const masked = (buf[1] & 0x80) !== 0;      // never set by a server
      let len = buf[1] & 0x7f;
      let offset = 2;
      if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); offset = 4; }
      else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); offset = 10; }
      if (masked) offset += 4;                    // tolerate, though Chrome won't
      if (buf.length < offset + len) return;      // frame still arriving
      const payload = buf.subarray(offset, offset + len);
      buf = buf.subarray(offset + len);

      if (opcode === 0x8) { socket.end(); return; }               // close
      if (opcode === 0x9) { socket.write(Buffer.concat([Buffer.from([0x8a, 0x80]), crypto.randomBytes(4)])); continue; } // ping -> pong
      if (opcode === 0xa) continue;                                // pong
      if (opcode === 0x0) fragParts.push(payload);                 // continuation
      else { fragOpcode = opcode; fragParts = [payload]; }
      if (!fin) continue;
      if (fragOpcode === 0x1) handleMessage(Buffer.concat(fragParts).toString("utf8"));
      fragParts = [];
    }
  });

  let nextId = 0;
  return {
    send(method, params = {}) {
      const id = ++nextId;
      socket.write(encodeTextFrame(JSON.stringify({ id, method, params })));
      return new Promise((res) => pending.set(id, res));
    },
    on(fn) { listeners.push(fn); },
    close() { try { socket.end(); } catch { /* already gone */ } },
  };
}

/** Launches headless Chrome and attaches to its first page target. */
export async function launchChrome({ port, userDataDir }) {
  const proc = spawn(findChrome(), [
    `--remote-debugging-port=${port}`, "--headless=new", "--no-first-run",
    "--no-default-browser-check", `--user-data-dir=${userDataDir}`,
    "--disable-gpu", "about:blank",
  ], { stdio: "ignore" });

  // Poll the debugging endpoint instead of sleeping a fixed amount — startup
  // time varies a lot between a cold and a warm profile.
  let targets;
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      targets = await res.json();
      if (targets.some((t) => t.type === "page")) break;
    } catch { /* not listening yet */ }
    await sleep(250);
  }
  const page = targets?.find((t) => t.type === "page");
  if (!page) { proc.kill(); throw new Error(`Chrome did not expose a page target on :${port} within 15s`); }

  const client = await connectCDP(page.webSocketDebuggerUrl);
  return { client, kill: () => { client.close(); proc.kill(); } };
}
