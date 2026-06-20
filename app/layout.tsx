import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
