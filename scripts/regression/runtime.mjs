import { setTimeout as sleep } from "node:timers/promises";
import { tmpdir } from "node:os"; import path from "node:path"; import fs from "node:fs";
import { launchChrome } from "/Users/marynababych/CC/New Portfolio/scripts/lib/cdp.mjs";
const BASE="http://localhost:3010";
let pass=0, fail=0;
const t=(n,ok,d="")=>{ if (ok) pass++; else fail++; console.log(`  ${ok?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`); };
const { client, kill } = await launchChrome({ port: 9702, userDataDir: path.join(tmpdir(),"retest-"+Date.now()) });
const send=(m,p)=>client.send(m,p);
await send("Page.enable"); await send("Runtime.enable"); await send("DOM.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1440,height:900,deviceScaleFactor:2,mobile:false});
await send("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"no-preference"}]});

// Sample MANY times across more than one loop — a square-wave opacity track
// sampled twice can land on the same value and look static.
async function animates(sel,label){
  const expr=`JSON.stringify([...document.querySelectorAll('${sel} g[class]')].map(g=>{const c=getComputedStyle(g);return c.transform+'|'+c.opacity}))`;
  const seen=new Set();
  for(let i=0;i<10;i++){
    const v=(await send("Runtime.evaluate",{expression:expr,returnByValue:true})).result.result.value;
    seen.add(v); await sleep(130);
  }
  const nodes=JSON.parse([...seen][0]||"[]").length;
  t(label, seen.size>1, `${seen.size} distinct states over 1.3s across ${nodes} animated groups`);
}

console.log("\n── SVG animation (sampled across a full loop) ──");
await send("Page.navigate",{url:BASE+"/"}); await sleep(5000);
await animates(".hero-cat","hero-cat animating");
await animates(".about-cat","about-cat animating");
await send("Page.navigate",{url:BASE+"/about"}); await sleep(5000);
await animates(".me-cat","me-cat animating");
await animates(".star1","star1 animating");

console.log("\n── Client nav, waiting for the cascade to finish ──");
await send("Page.navigate",{url:BASE+"/"}); await sleep(5000);
const nav=(await send("Runtime.evaluate",{expression:`new Promise(res=>{
  const a=document.querySelector('a[href^="/work/"]'); a.scrollIntoView({block:'center'});
  setTimeout(()=>{const t0=performance.now(); a.click();
    const done=setInterval(()=>{
      if(location.pathname.startsWith('/work/') && !document.querySelector('.page-curtain')){
        clearInterval(done);
        const settled=Math.round(performance.now()-t0);
        // The reveal cascade is 1.6s + stagger; let it finish before asserting.
        setTimeout(()=>{
          const heads=[...document.querySelectorAll('.line-reveal')];
          const ra=[...document.querySelectorAll('.reveal-anim[data-play]')];
          res(JSON.stringify({settled, path:location.pathname,
            heads:heads.map(h=>({lines:h.getAttribute('data-lines'),rev:h.hasAttribute('data-revealed'),
              minOp:Math.min(...[...h.children].map(s=>+getComputedStyle(s).opacity))})),
            blocks: ra.length? Math.min(...ra.map(x=>+getComputedStyle(x).opacity)) : 1, blockCount: ra.length}));
        }, 3000);
      }},80);
  },400);})`,returnByValue:true,awaitPromise:true,timeout:30000})).result.result.value;
const n=JSON.parse(nav);
t("client nav completes", n.path.startsWith("/work/"), `${n.path} settled in ${n.settled}ms`);
t("headings revealed via effect fallback", n.heads.every(h=>h.rev && h.minOp===1), JSON.stringify(n.heads.map(h=>h.lines+"/"+h.minOp)));
t("block reveals visible", n.blocks===1, `${n.blockCount} @ ${n.blocks}`);

console.log("\n── No JavaScript (screenshot + served HTML) ──");
await send("Emulation.setScriptExecutionDisabled",{value:true});
await send("Page.navigate",{url:BASE+"/"}); await sleep(3500);
const s=await send("Page.captureScreenshot",{format:"png"});
const buf=Buffer.from(s.result.data,"base64");
fs.writeFileSync("/private/tmp/claude-501/-Users-marynababych-CC/dbd2452b-8faa-4eba-a776-04434159bc23/scratchpad/nojs-regress.png", buf);
// Mean brightness: a blank page in light mode is uniformly bright.
const doc=await send("DOM.getDocument",{depth:-1});
const found=JSON.stringify(doc).includes("Lead Product Designer");
t("no-JS: headline text in the DOM tree", found);
t("no-JS: screenshot captured", buf.length>10000, (buf.length/1024).toFixed(0)+"KB");
await send("Emulation.setScriptExecutionDisabled",{value:false});
kill();
console.log(`\n  ${pass} passed, ${fail} failed`);
