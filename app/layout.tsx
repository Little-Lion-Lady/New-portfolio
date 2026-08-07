import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { LazyMotion, domAnimation } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Both fonts come from the geist package (local woff2, no network request).
// Each exposes a CSS variable applied via className on <html>:
//
//   GeistSans → --font-geist-sans → body AND display text (per Instruction.md)
//   GeistMono → --font-geist-mono → monospaced / labels
//
// Note: the refined token system uses Geist for display headings — there is no
// separate pixel display font in this system.

export const metadata: Metadata = {
  title: "Maryna Babych — Lead Product Designer",
  description:
    "Portfolio of Maryna Babych, Lead Product Designer based in Auckland, New Zealand. 9 years crafting award-winning digital experiences.",
};

// First-time visitors get no data-theme attribute, which lets the CSS
// prefers-color-scheme media query in globals.css handle the default with no
// flash and no inline <script>. ThemeToggle (built later) adds a client-side
// session override.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        GeistSans.variable,
        GeistMono.variable,
        "h-full antialiased",
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved theme before first paint to prevent flash.
            beforeInteractive runs before the page is hydrated so data-theme
            is set before any CSS tokens resolve. */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`}</Script>
      </head>
      <body className="min-h-full flex flex-col">
        {/* domAnimation covers everything the site uses (hover/tap/animate/
            AnimatePresence) without drag/layout — smaller than importing the
            full `motion` feature set on every page. `m.*` components below
            read features from this provider instead of bundling their own. */}
        <LazyMotion features={domAnimation} strict>
          {children}
        </LazyMotion>
        <Analytics />
      </body>
    </html>
  );
}
