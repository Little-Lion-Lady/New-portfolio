/*
  Lottie JSON  ->  a self-contained animated SVG driven by CSS keyframes.

  Why this exists: lottie-web is 170KB raw / 47.6KB gzipped, and it is on the
  homepage's critical path purely to play four decorative line drawings. The
  animation DATA is cheap (~26KB gzipped for all of them); the player is not.
  An SVG that animates itself needs no player at all.

  This is not a general Lottie converter and does not try to be. It handles
  exactly what these files contain, which was checked before a line of it was
  written:

      animated properties   opacity, scale, position, rotation
      animated paths        NONE — no shape morphing anywhere
      expressions           none      effects   none
      images                none      text      none
      mattes                none      masks     none

  It refuses anything outside that (see `unsupported`), rather than emitting a
  drawing that is silently wrong.

  ── On easing ──────────────────────────────────────────────────────────────
  Lottie eases each property independently, with a per-segment cubic bezier.
  CSS applies one timing function per keyframe stop, to every property in it.
  Translating one to the other is only exact when every animated property on a
  layer shares its keyframe times AND its easing, which is not true here.

  So the animation is SAMPLED once per frame instead, and the stops are
  interpolated linearly. At the composition's own frame rate that is not an
  approximation of the curve — it is the same set of values the player would
  compute, and any difference is smaller than one frame. It also removes a
  whole class of bug: no easing conversion to get subtly wrong.

  ── Usage ──────────────────────────────────────────────────────────────────
      node scripts/lottie-to-svg.mjs public/home/hero-cat.json [out.svg]

  Colours are emitted as CSS custom properties (--c0, --c1, ...) with the
  original value as the fallback, so a theme can re-map any of them from a
  stylesheet instead of rewriting the animation data at runtime.
*/
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// ─── Property evaluation ─────────────────────────────────────────────────────

/** Solve cubic-bezier(x1,y1,x2,y2) for y at a given x, by bisection. */
function bezier(x1, y1, x2, y2, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = (t) => 3 * t * (1 - t) ** 2 * x1 + 3 * t ** 2 * (1 - t) * x2 + t ** 3;
  const cy = (t) => 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3;
  let lo = 0, hi = 1, t = x;
  for (let i = 0; i < 24; i++) {
    t = (lo + hi) / 2;
    if (cx(t) < x) lo = t;
    else hi = t;
  }
  return cy(t);
}

const num = (v) => (Array.isArray(v) ? v[0] : v);

/**
 * Value of a Lottie property at `frame`.
 * Static properties are `{a:0, k}`; animated ones are `{a:1, k:[keyframes]}`.
 */
function valueAt(prop, frame, fallback) {
  if (prop == null) return fallback;
  if (prop.a !== 1) return prop.k ?? fallback;

  const kf = prop.k;
  if (!kf.length) return fallback;
  if (frame <= kf[0].t) return kf[0].s;

  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i], b = kf[i + 1];
    if (frame < a.t || frame > b.t) continue;
    const from = a.s;
    const to = b.s ?? a.e;
    if (to === undefined) return from;
    if (a.h) return from; // hold
    const span = b.t - a.t || 1;
    const p = (frame - a.t) / span;
    const dims = Array.isArray(from) ? from.length : 1;
    const out = [];
    for (let d = 0; d < dims; d++) {
      // Per-dimension easing when the handles are arrays, shared when not.
      const ox = num(Array.isArray(a.o?.x) ? a.o.x[d] ?? a.o.x[0] : a.o?.x) ?? 0.333;
      const oy = num(Array.isArray(a.o?.y) ? a.o.y[d] ?? a.o.y[0] : a.o?.y) ?? 0;
      const ix = num(Array.isArray(a.i?.x) ? a.i.x[d] ?? a.i.x[0] : a.i?.x) ?? 0.667;
      const iy = num(Array.isArray(a.i?.y) ? a.i.y[d] ?? a.i.y[0] : a.i?.y) ?? 1;
      const e = bezier(ox, oy, ix, iy, p);
      const f = Array.isArray(from) ? from[d] : from;
      const t = Array.isArray(to) ? to[d] : to;
      out.push(f + (t - f) * e);
    }
    return Array.isArray(from) ? out : out[0];
  }
  const last = kf[kf.length - 1];
  return last.s ?? last.e ?? fallback;
}

const isAnimated = (p) => !!p && p.a === 1 && Array.isArray(p.k) && p.k.length > 1;

/*
  A track made entirely of HOLD keyframes is a square wave, not a curve. These
  files use them for blinking: pairs of keyframes sharing a timestamp, one
  ending the old value and one starting the new, so the change is instant.

  It matters because of what happens downstream. Sampling such a track per
  frame is correct, but CSS then interpolates linearly BETWEEN stops, which
  turns every instant switch into a one-frame ramp — and turns the stop that
  closes the loop into a visible fade. That was the pale sparkle on hero-cat's
  last frame: a layer Lottie holds at full opacity until it snaps to zero was
  instead sliding down to zero across the final 1/36th of the loop.

  Layers whose animated tracks are ALL holds get `step-end` instead, which
  reproduces the square wave exactly. Layers with any genuinely eased track
  keep linear interpolation, where per-frame sampling is already faithful.
*/
const allHold = (p) => isAnimated(p) && p.k.every((k) => k.h === 1);

// ─── Geometry ────────────────────────────────────────────────────────────────

const r3 = (n) => Math.round(n * 1000) / 1000;

/** Lottie bezier shape -> SVG path data. */
function shapeToPath(ks) {
  const v = ks.v || [], i = ks.i || [], o = ks.o || [];
  if (!v.length) return "";
  let d = `M${r3(v[0][0])},${r3(v[0][1])}`;
  for (let n = 1; n < v.length; n++) {
    const c1 = [v[n - 1][0] + o[n - 1][0], v[n - 1][1] + o[n - 1][1]];
    const c2 = [v[n][0] + i[n][0], v[n][1] + i[n][1]];
    d += `C${r3(c1[0])},${r3(c1[1])} ${r3(c2[0])},${r3(c2[1])} ${r3(v[n][0])},${r3(v[n][1])}`;
  }
  if (ks.c) {
    const last = v.length - 1;
    const c1 = [v[last][0] + o[last][0], v[last][1] + o[last][1]];
    const c2 = [v[0][0] + i[0][0], v[0][1] + i[0][1]];
    d += `C${r3(c1[0])},${r3(c1[1])} ${r3(c2[0])},${r3(c2[1])} ${r3(v[0][0])},${r3(v[0][1])}Z`;
  }
  return d;
}

/** Lottie colour (0-1 rgba) -> CSS. */
function colour(c, alpha = 100) {
  const [r, g, b, a = 1] = c;
  const to255 = (x) => Math.round(x * 255);
  const op = (a ?? 1) * (alpha / 100);
  return op >= 1
    ? `#${[r, g, b].map((x) => to255(x).toString(16).padStart(2, "0")).join("")}`
    : `rgba(${to255(r)},${to255(g)},${to255(b)},${r3(op)})`;
}

/** Lottie transform block -> an SVG/CSS transform string at `frame`. */
function transformAt(ks, frame) {
  const a = valueAt(ks.a, frame, [0, 0]);
  const p = valueAt(ks.p, frame, [0, 0]);
  const s = valueAt(ks.s, frame, [100, 100]);
  const r = valueAt(ks.r, frame, 0);
  const parts = [];
  if (p[0] || p[1]) parts.push(`translate(${r3(p[0])}px,${r3(p[1])}px)`);
  if (r) parts.push(`rotate(${r3(r)}deg)`);
  if (s[0] !== 100 || s[1] !== 100) parts.push(`scale(${r3(s[0] / 100)},${r3(s[1] / 100)})`);
  if (a[0] || a[1]) parts.push(`translate(${r3(-a[0])}px,${r3(-a[1])}px)`);
  return parts.join(" ") || "none";
}

const transformAnimated = (ks) =>
  isAnimated(ks.a) || isAnimated(ks.p) || isAnimated(ks.s) || isAnimated(ks.r);

// ─── Emit ────────────────────────────────────────────────────────────────────

const SUPPORTED_SHAPES = new Set(["gr", "sh", "rc", "el", "fl", "st", "tr"]);

export function convert(doc, { name = "lottie" } = {}) {
  const unsupported = new Set();
  /* Frame `op` is the loop POINT, not a frame of its own — it holds the same
     values as frame `ip`. Sampling 0..total inclusive therefore emitted 37
     stops for a 36-frame loop and stretched everything by one frame, which
     showed up as a visible drift by the middle of the animation. Sample
     0..total-1 and close the loop with a final stop copied from the first. */
  const total = Math.max(1, Math.round(doc.op - (doc.ip || 0)));
  const frames = [];
  for (let f = 0; f < total; f++) frames.push((doc.ip || 0) + f);

  const assets = new Map((doc.assets || []).map((a) => [a.id, a]));
  const colours = [];
  const colourIndex = new Map();
  const keyframeBlocks = [];
  const steppedIds = [];
  let uid = 0;

  const cssColour = (value) => {
    if (!colourIndex.has(value)) {
      colourIndex.set(value, colours.length);
      colours.push(value);
    }
    const i = colourIndex.get(value);
    return `var(--c${i},${value})`;
  };

  /*
    Two things Lottie keeps separate, which a first attempt at this conflated:

      DRAW ORDER   the layers array, index 0 on top
      PARENTING    `parent` names another layer whose TRANSFORM this one
                   inherits — it says nothing about where either is drawn

    Nesting children inside their parent gets the transform right and the
    stacking wrong, which is what put the laptop over the star and dropped
    most of me-cat. So layers are emitted FLAT, in reverse array order (last
    first, so index 0 ends up painted last and therefore on top), and each
    one's parent chain is composed into a single matrix instead.

    Composing is cheap here because everything is sampled per frame anyway:
    there is no need to express an inherited animation symbolically, just
    multiply the matrices at each frame.

    Precomps are the one thing that genuinely nests — a precomp layer's
    transform and opacity do apply to its contents — so those become a real
    <g> wrapping the asset's own layer list.
  */
  const mul = (m, n) => [
    m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
  ];

  /* Lottie's layer transform, in order: translate(position), rotate,
     scale, then translate(-anchor). */
  function matrixFor(ks, frame) {
    const a = valueAt(ks.a, frame, [0, 0]);
    const p = valueAt(ks.p, frame, [0, 0]);
    const sc = valueAt(ks.s, frame, [100, 100]);
    const rot = ((valueAt(ks.r, frame, 0) || 0) * Math.PI) / 180;
    const cos = Math.cos(rot), sin = Math.sin(rot);
    let m = [1, 0, 0, 1, p[0] || 0, p[1] || 0];
    m = mul(m, [cos, sin, -sin, cos, 0, 0]);
    m = mul(m, [(sc[0] ?? 100) / 100, 0, 0, (sc[1] ?? 100) / 100, 0, 0]);
    m = mul(m, [1, 0, 0, 1, -(a[0] || 0), -(a[1] || 0)]);
    return m;
  }

  function worldMatrix(layer, byInd, frame, seen = new Set()) {
    const local = matrixFor(layer.ks || {}, frame);
    const parent = layer.parent != null ? byInd.get(layer.parent) : null;
    if (!parent || seen.has(layer.ind)) return local;
    seen.add(layer.ind);
    return mul(worldMatrix(parent, byInd, frame, seen), local);
  }

  /* Stepped only if every track that actually animates is a hold track —
     one eased property on the layer or anywhere up its parent chain and the
     whole layer has to interpolate. */
  const chainStepped = (layer, byInd, seen = new Set()) => {
    if (!layer || seen.has(layer.ind)) return true;
    seen.add(layer.ind);
    const ks = layer.ks || {};
    for (const t of [ks.a, ks.p, ks.s, ks.r]) if (isAnimated(t) && !allHold(t)) return false;
    const parent = layer.parent != null ? byInd.get(layer.parent) : null;
    return chainStepped(parent, byInd, seen);
  };

  const chainAnimated = (layer, byInd, seen = new Set()) => {
    if (!layer || seen.has(layer.ind)) return false;
    seen.add(layer.ind);
    if (transformAnimated(layer.ks || {})) return true;
    const parent = layer.parent != null ? byInd.get(layer.parent) : null;
    return chainAnimated(parent, byInd, seen);
  };

  const fmt = (m) => `matrix(${m.map(r3).join(",")})`;

  /* A layer only exists between its in and out points. Baked into the opacity
     track rather than handled separately, so a layer that appears partway
     through the loop does so at exactly the right frame. */
  const visibleAt = (layer, f) =>
    (layer.ip == null || f >= layer.ip) && (layer.op == null || f < layer.op);

  function renderLayers(layers, depth) {
    const byInd = new Map(layers.map((l) => [l.ind, l]));
    const out = [];

    for (const layer of [...layers].reverse()) {
      if (layer.ty === 3) continue; // null: transform only, nothing to draw
      if (layer.ty !== 4 && layer.ty !== 0) {
        unsupported.add(`layer type ${layer.ty}`);
        continue;
      }

      let content = "";
      if (layer.ty === 4) content = renderShapes(layer.shapes || [], depth + 1);
      else {
        const asset = assets.get(layer.refId);
        if (asset) content = renderLayers(asset.layers || [], depth + 1);
      }
      if (!content) continue;

      const ks = layer.ks || {};
      const animated =
        chainAnimated(layer, byInd) ||
        isAnimated(ks.o) ||
        frames.some((f) => !visibleAt(layer, f));

      const opacityAt = (f) =>
        (visibleAt(layer, f) ? valueAt(ks.o, f, 100) : 0) / 100;

      const styles = [
        "transform-origin:0 0",
        `transform:${fmt(worldMatrix(layer, byInd, frames[0]))}`,
      ];
      const o0 = opacityAt(frames[0]);
      if (o0 !== 1) styles.push(`opacity:${r3(o0)}`);

      let cls = "";
      if (animated) {
        const id = `${name}-a${uid++}`;
        const stepped =
          chainStepped(layer, byInd) && (!isAnimated(ks.o) || allHold(ks.o));
        const at = (f) =>
          `transform:${fmt(worldMatrix(layer, byInd, f))};opacity:${r3(opacityAt(f))}`;
        const stops = frames.map((f, idx) => `${r3((idx / total) * 100)}%{${at(f)}}`);
        stops.push(`100%{${at(frames[0])}}`);
        const body = (x) => x.slice(x.indexOf("{"));
        const trimmed = stops.filter(
          (st, i, arr) =>
            i === 0 || i === arr.length - 1 || body(st) !== body(arr[i - 1]) || body(st) !== body(arr[i + 1]),
        );
        keyframeBlocks.push(`@keyframes ${id}{${trimmed.join("")}}`);
        if (stepped) steppedIds.push(id);
        cls = ` class="${id}"`;
      }
      out.push(`<g${cls} style="${styles.join(";")}">${content}</g>`);
    }
    return out.join("");
  }

  function renderShapes(shapes, depth) {
    const out = [];
    // A group's paint (fl/st) applies to the paths declared alongside it.
    let fill = null, stroke = null, groupTransform = null, groupOpacity = 1;
    const geometry = [];
    // Every `sh` in this group is a subpath of ONE filled path — that is what
    // makes a counter a hole rather than a blob. Collected, then emitted as a
    // single <path> with the group's fill rule.
    const subpaths = [];

    for (const s of shapes) {
      if (!SUPPORTED_SHAPES.has(s.ty)) {
        unsupported.add(`shape ${s.ty}`);
        continue;
      }
      if (s.ty === "gr") {
        out.push(renderShapes(s.it || [], depth + 1));
      } else if (s.ty === "sh") {
        if (isAnimated(s.ks)) unsupported.add("animated path");
        subpaths.push(shapeToPath(valueAt(s.ks, frames[0], { v: [] })));
      } else if (s.ty === "rc") {
        const p = valueAt(s.p, frames[0], [0, 0]);
        const sz = valueAt(s.s, frames[0], [0, 0]);
        const rr = valueAt(s.r, frames[0], 0);
        geometry.push({ kind: "rect", x: p[0] - sz[0] / 2, y: p[1] - sz[1] / 2, w: sz[0], h: sz[1], r: rr });
      } else if (s.ty === "el") {
        const p = valueAt(s.p, frames[0], [0, 0]);
        const sz = valueAt(s.s, frames[0], [0, 0]);
        geometry.push({ kind: "ellipse", cx: p[0], cy: p[1], rx: sz[0] / 2, ry: sz[1] / 2 });
      } else if (s.ty === "fl") {
        // r: 1 = nonzero, 2 = evenodd. After Effects writes the rule the
        // artwork was drawn against; guessing one silently fills holes.
        fill = { c: valueAt(s.c, frames[0], [0, 0, 0]), o: valueAt(s.o, frames[0], 100), r: s.r };
      } else if (s.ty === "st") {
        stroke = {
          c: valueAt(s.c, frames[0], [0, 0, 0]),
          o: valueAt(s.o, frames[0], 100),
          w: valueAt(s.w, frames[0], 1),
          lc: s.lc, lj: s.lj,
        };
      } else if (s.ty === "tr") {
        groupTransform = transformAt(s, frames[0]);
        groupOpacity = valueAt(s.o, frames[0], 100) / 100;
        if (transformAnimated(s) || isAnimated(s.o)) unsupported.add("animated group transform");
      }
    }

    if (subpaths.length) geometry.unshift({ kind: "path", d: subpaths.join("") });

    if (geometry.length) {
      const paint = [];
      // A fully transparent fill is an After Effects bounding box, not art.
      if (fill && (fill.o ?? 100) > 0 && (fill.c[3] ?? 1) > 0) {
        paint.push(`fill="${cssColour(colour(fill.c, fill.o))}"`);
        if (fill.r === 2) paint.push(`fill-rule="evenodd"`);
      } else paint.push(`fill="none"`);
      if (stroke && (stroke.o ?? 100) > 0) {
        paint.push(`stroke="${cssColour(colour(stroke.c, stroke.o))}"`);
        paint.push(`stroke-width="${r3(stroke.w)}"`);
        if (stroke.lc === 2) paint.push(`stroke-linecap="round"`);
        if (stroke.lc === 3) paint.push(`stroke-linecap="square"`);
        if (stroke.lj === 2) paint.push(`stroke-linejoin="round"`);
        if (stroke.lj === 3) paint.push(`stroke-linejoin="bevel"`);
      }
      const els = geometry.map((g) => {
        if (g.kind === "path") return `<path d="${g.d}"/>`;
        if (g.kind === "rect")
          return `<rect x="${r3(g.x)}" y="${r3(g.y)}" width="${r3(g.w)}" height="${r3(g.h)}"${g.r ? ` rx="${r3(g.r)}"` : ""}/>`;
        return `<ellipse cx="${r3(g.cx)}" cy="${r3(g.cy)}" rx="${r3(g.rx)}" ry="${r3(g.ry)}"/>`;
      });
      const style = [];
      if (groupTransform && groupTransform !== "none") style.push(`transform:${groupTransform};transform-origin:0 0`);
      if (groupOpacity !== 1) style.push(`opacity:${r3(groupOpacity)}`);
      out.push(
        `<g ${paint.join(" ")}${style.length ? ` style="${style.join(";")}"` : ""}>${els.join("")}</g>`,
      );
    }
    return out.join("");
  }

  const body = renderLayers(doc.layers || [], 0);
  const durationS = r3(total / (doc.fr || 60));

  const css = [
    `svg.${name}{--dur:${durationS}s}`,
    // Deliberately no animation-timing-function here: this selector outranks the
    // per-layer `.name-aN` rules below, and a hold track needs step-end from one
    // of those. Timing is set per layer instead.
    `svg.${name} g[class^="${name}-a"]{animation-duration:var(--dur);animation-iteration-count:infinite;animation-fill-mode:both}`,
    ...keyframeBlocks,
    ...keyframeBlocks.map(
      (_, i) =>
        `.${name}-a${i}{animation-name:${name}-a${i};animation-timing-function:` +
        `${steppedIds.includes(`${name}-a${i}`) ? "step-end" : "linear"}}`,
    ),
    // Motion is decoration here. Under reduced-motion the drawing holds on its
    // first frame, which is what the Lottie build did by refusing to autoplay.
    `@media (prefers-reduced-motion:reduce){svg.${name} g[class^="${name}-a"]{animation:none}}`,
  ].join("\n");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" class="${name}" viewBox="0 0 ${doc.w} ${doc.h}" ` +
    `width="${doc.w}" height="${doc.h}" role="img" aria-hidden="true">` +
    `<style>${css}</style>${body}</svg>`;

  return { svg, unsupported: [...unsupported], colours, frames: total, durationS };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

// pathToFileURL, not a template string: this repo lives under a directory
// with a space in its name, so the raw argv path and the percent-encoded
// import.meta.url never compare equal.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const input = process.argv[2];
  if (!input) {
    console.error("usage: node scripts/lottie-to-svg.mjs <lottie.json> [out.svg]");
    process.exit(1);
  }
  const doc = JSON.parse(fs.readFileSync(input, "utf8"));
  const name = path.basename(input, ".json").replace(/[^a-z0-9]/gi, "-");
  const { svg, unsupported, colours, frames, durationS } = convert(doc, { name });
  const out = process.argv[3] ?? input.replace(/\.json$/, ".svg");
  fs.writeFileSync(out, svg);
  const raw = Buffer.byteLength(svg);
  console.log(
    `${path.basename(input)} -> ${path.basename(out)}  ${frames} frames / ${durationS}s  ` +
      `${(raw / 1024).toFixed(1)}KB raw  ${colours.length} colours`,
  );
  if (unsupported.length) console.log(`  UNSUPPORTED: ${unsupported.join(", ")}`);
}
