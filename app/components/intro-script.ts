/*
  Intro loader timing, plus the inline <head> script that decides whether the
  loader shows at all.

  A plain module (no "use client") because layout.tsx, a Server Component,
  needs the VALUE of INTRO_SCRIPT — see line-reveal.ts for the same constraint.

  The script runs during parse, before first paint, so the decision is made
  before anything is drawn: a visitor who has already seen the intro this
  session never gets a frame of it. It also owns `__introLift`, the one way the
  loader is taken down, so the safety timer below still lifts it when React
  never hydrates.
*/

/** Shortest time the loader stays up, so "hi there" reads rather than flashes. */
export const INTRO_MIN_MS = 1200;
/** Longest the loader waits on assets before lifting anyway. */
export const INTRO_MAX_MS = 4000;
/** Loader fade-out. Keep in step with `.intro` in globals.css. */
export const INTRO_OUT_MS = 600;

export const INTRO_SCRIPT =
  `(function(){var d=document.documentElement;` +
  `try{if(sessionStorage.getItem("intro-seen"))return;sessionStorage.setItem("intro-seen","1");}catch(e){return;}` +
  `d.setAttribute("data-intro","");d.setAttribute("data-intro-start",String(Date.now()));` +
  `window.__introLift=function(){if(!d.hasAttribute("data-intro"))return;` +
  `d.setAttribute("data-intro-lifted-at",String(Date.now()));` +
  `d.removeAttribute("data-intro");d.setAttribute("data-intro-out","");` +
  `document.dispatchEvent(new Event("intro:lift"));` +
  `setTimeout(function(){d.removeAttribute("data-intro-out");},${INTRO_OUT_MS + 100});};` +
  `setTimeout(window.__introLift,${INTRO_MAX_MS + 1000});})();`;
