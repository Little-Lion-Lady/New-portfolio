import fs from "node:fs";
let pass=0, fail=0;
const t=(n,ok,d="")=>{ (ok?pass++:fail++); console.log(`  ${ok?"PASS":"FAIL"}  ${n}${d?"  — "+d:""}`); };
const routes={ "index":"/", "about":"/about", "work/first-table":"/work/first-table",
               "work/basis":"/work/basis", "work/covid-tracer":"/work/covid-tracer" };
const read=f=>fs.readFileSync(`.next/server/app/${f}.html`,"utf8");
// metadataBase is localhost in a local build; compare the PATH only.
const pathOf=(url)=>{ if(!url) return null; try{ return new URL(url).pathname.replace(/\/$/,"")||"/"; }catch{ return url; } };

console.log("\n── Metadata ──");
for (const [f,p] of Object.entries(routes)) {
  const h=read(f), g=re=>(h.match(re)||[])[1];
  t(`${p} canonical`, pathOf(g(/<link rel="canonical" href="([^"]*)"/))===p, pathOf(g(/<link rel="canonical" href="([^"]*)"/)));
  t(`${p} og:url`, pathOf(g(/<meta property="og:url" content="([^"]*)"/))===p);
  const ogt=g(/<meta property="og:title" content="([^"]*)"/);
  t(`${p} og:title route-specific`, p==="/" || ogt!=="Maryna Babych — Lead Product Designer", (ogt||"").slice(0,40));
  t(`${p} og:image`, /property="og:image"/.test(h));
  t(`${p} twitter:image`, /name="twitter:image"/.test(h));
  t(`${p} description`, (g(/<meta name="description" content="([^"]*)"/)||"").length>40);
  const ld=(h.match(/<script type="application\/ld\+json">/g)||[]).length;
  t(`${p} ld+json`, p.startsWith("/work") ? ld===2 : ld===1, String(ld));
}

console.log("\n── Fonts / bundle ──");
const home=read("index");
const fonts=[...home.matchAll(/<link rel="preload" href="([^"]*)"[^>]*as="font"/g)].map(m=>m[1].split("/").pop());
t("one font preloaded", fonts.length===1, fonts.join(","));
t("no GeistMono in build", !/GeistMono|geist-mono/.test(home));
t("lottie gone from lockfile", !/lottie/.test(fs.readFileSync("package-lock.json","utf8")));
t("lottie gone from node_modules", !fs.existsSync("node_modules/lottie-web")&&!fs.existsSync("node_modules/lottie-react"));

console.log("\n── Reveal wiring ──");
for (const [f,p] of Object.entries(routes)) {
  const h=read(f);
  t(`${p} one grouping script`, (h.match(/querySelectorAll\("\.line-reveal"\)/g)||[]).length===1);
  t(`${p} no per-heading script`, (h.match(/getElementById\([^)]*\)[^<]{0,80}offsetTop/g)||[]).length===0);
  t(`${p} no inline opacity:0 on h1`, !/<h1[\s\S]{0,2500}?opacity:0/.test(h));
}
t("data-js gate", /data-js/.test(home));

console.log("\n── Images / video ──");
t("no fetchpriority=high on homepage", (home.match(/fetchpriority="high"/gi)||[]).length===0);
const ft=read("work/first-table");
// The RSC payload still carries the src as data; what matters is the ELEMENT.
t("no <video src=> in markup", (ft.match(/<video[^>]*\ssrc=/g)||[]).length===0, (ft.match(/<video/g)||[]).length+" video tags");
t("videos preload=none", (ft.match(/<video[^>]*preload="none"/g)||[]).length===4);

console.log("\n── Alt text ──");
for (const [f,p] of Object.entries(routes)) {
  const alts=[...read(f).matchAll(/alt="([^"]*)"/g)].map(m=>m[1]).filter(Boolean);
  const c={}; alts.forEach(a=>c[a]=(c[a]||0)+1);
  const w=Object.entries(c).sort((a,b)=>b[1]-a[1])[0]||["",0];
  t(`${p} alt repetition <= 4`, w[1]<=4, `${w[1]}x`);
}

console.log("\n── Headers ──");
const m=JSON.parse(fs.readFileSync(".next/routes-manifest.json","utf8"));
const keys=(m.headers?.[0]?.headers||[]).map(x=>x.key);
["X-Content-Type-Options","Referrer-Policy","X-Frame-Options","Permissions-Policy"].forEach(k=>t(`header ${k}`, keys.includes(k)));

console.log(`\n  ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
