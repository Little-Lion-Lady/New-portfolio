import { LINE_STAGGER } from "./motion-timing";

/*
  Line grouping for the headline reveal — the one thing CSS cannot work out
  for itself: which wrapped line each token landed on.

  Deliberately a plain module with no "use client", for the same reason
  motion-timing.ts is one: layout.tsx is a Server Component and needs the
  VALUE of LINE_REVEAL_SCRIPT below. An export of a "use client" module
  reaches a Server Component as a client reference, not as its value, so the
  script would arrive as an opaque object and get rendered as "[object]".

  It lives here rather than in reveal.tsx because of where the script has to
  be rendered from. reveal.tsx is a Client Component, and a <script> element
  rendered by one draws "Encountered a script tag while rendering React
  component. Scripts inside React components are never executed when
  rendering on the client." React is right: on a client render it would be
  inert. Server-rendered it works exactly as intended — which is why the theme
  script in layout.tsx has never had the same complaint — so the script is
  emitted from there instead, once, for every heading on the page.
*/

/**
 * Group a heading's tokens by the line they wrapped onto, and release the
 * CSS animation.
 *
 * Tokens on one wrapped line share an offsetTop. The 2px tolerance absorbs
 * sub-pixel differences between tokens of different heights; a real line
 * break moves by a whole line-height.
 */
export function groupLines(el: Element, startLine: number, stagger = LINE_STAGGER) {
  const spans = el.children;
  if (!spans.length) return;
  const stamp = (node: HTMLElement, line: number) => {
    node.style.setProperty("--line", String(line));
    // TitleStars pins its cluster to a word and has to share that word's place
    // in the cascade. Under a line-grouped reveal the offset comes from the
    // measured line, not the token index, so it can only be published here.
    node.setAttribute("data-reveal-delay", String((startLine + line) * stagger));
  };
  let lineTop = (spans[0] as HTMLElement).offsetTop;
  let line = 0;
  stamp(spans[0] as HTMLElement, 0);
  for (let i = 1; i < spans.length; i++) {
    const s = spans[i] as HTMLElement;
    if (s.offsetTop - lineTop > 2) {
      line += 1;
      lineTop = s.offsetTop;
    }
    stamp(s, line);
  }
  el.setAttribute("data-lines", String(line + 1));
  el.setAttribute("data-revealed", "");
}

/*
  The same routine as a string, for the inline <script> in layout.tsx.

  A duplicate rather than a serialised `groupLines.toString()`, deliberately:
  this has to survive minification, and a bundler is free to rename anything
  it can see.

  It takes no arguments and reads each heading's own configuration back out of
  the DOM — `--start-line` from the inline style, the stagger from
  data-word-stagger — so one script handles every heading on the page without
  the markup and the script having to agree on a list.
*/
export const LINE_REVEAL_SCRIPT =
  `(function(){var H=document.querySelectorAll(".line-reveal");` +
  `for(var k=0;k<H.length;k++){var h=H[k];if(h.hasAttribute("data-revealed"))continue;` +
  `var s=h.children,n=s.length;if(!n)continue;` +
  `var b=parseFloat(h.style.getPropertyValue("--start-line"))||0;` +
  `var g=parseFloat(h.getAttribute("data-word-stagger"))||${LINE_STAGGER};` +
  `function m(e,l){e.style.setProperty("--line",String(l));` +
  `e.setAttribute("data-reveal-delay",String((b+l)*g));}` +
  `var t=s[0].offsetTop,l=0;m(s[0],0);` +
  `for(var i=1;i<n;i++){var o=s[i].offsetTop;if(o-t>2){l++;t=o;}m(s[i],l);}` +
  `h.setAttribute("data-lines",String(l+1));h.setAttribute("data-revealed","");}})();`;
