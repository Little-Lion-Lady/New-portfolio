import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { LazyMotion, domAnimation } from "framer-motion";
import { Analytics } from "@vercel/analytics/next";
import { InitialThemeProvider } from "./components/theme-context";
import { PageCurtain } from "./components/page-curtain";
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

// The "theme" cookie (set by ThemeToggle) is the source of truth read here on
// the server, so the very first render already has the right data-theme
// attribute and ThemeToggle's icon matches on both server and client passes —
// no more guessing client-side, which is what caused the hydration mismatch.
// First-time visitors have no cookie: they get no data-theme attribute, which
// lets the CSS prefers-color-scheme media query in globals.css handle the
// default with no flash. The beforeInteractive script below only exists to
// migrate visitors who saved a preference before this cookie existed.
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

  return (
    <html
      lang="en"
      data-theme={theme}
      className={[
        GeistSans.variable,
        GeistMono.variable,
        "h-full antialiased",
      ].join(" ")}
      suppressHydrationWarning
    >
      <head>
        {/* One-time migration for visitors who saved a theme in localStorage
            before the "theme" cookie existed: mirrors it into the cookie (so
            the next request's SSR picks it up) and applies it before first
            paint to prevent flash on this load. */}
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('theme');if((t==='dark'||t==='light')&&!/(?:^|; )theme=/.test(document.cookie)){document.cookie='theme='+t+'; path=/; max-age=31536000; samesite=lax';document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`}</Script>
      </head>
      <body className="min-h-full flex flex-col">
        {/* domAnimation covers everything the site uses (hover/tap/animate/
            AnimatePresence) without drag/layout — smaller than importing the
            full `motion` feature set on every page. `m.*` components below
            read features from this provider instead of bundling their own. */}
        <InitialThemeProvider initialIsDark={theme === "dark" ? true : theme === "light" ? false : undefined}>
          <LazyMotion features={domAnimation} strict>
            {children}
            {/* Route transition: sweeps up over the outgoing page, swaps, sweeps off. */}
            <PageCurtain />
          </LazyMotion>
        </InitialThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
