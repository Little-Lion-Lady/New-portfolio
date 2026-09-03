import { ImageResponse } from "next/og";

/*
  The card that renders wherever the site gets pasted — LinkedIn, Slack,
  Messages, X. Next picks this file up by convention and wires it into both the
  Open Graph and Twitter cards, so neither block in layout.tsx names an image.

  Generated rather than shipped as a flat file so the copy stays in source
  control next to the metadata it mirrors. Built at build time (the route is
  static), so it costs nothing per request.

  Typeface is the platform default rather than Geist: loading a woff here means
  reading it off disk at build, and at 1200×630 with two weights of one family
  the difference is not worth the extra failure mode. Colours are the site's
  own dark tokens.
*/
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Maryna Babych — Lead Product Designer, Auckland New Zealand";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a090a",
          padding: "76px 84px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#3744ff" }} />
          <div style={{ fontSize: 26, color: "#7d767f", letterSpacing: 2, textTransform: "uppercase" }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: "#fafafa", letterSpacing: -3, lineHeight: 1.05 }}>
            Maryna Babych
          </div>
          <div style={{ fontSize: 46, color: "#b8b8b8", marginTop: 14, letterSpacing: -1 }}>
            Lead Product Designer
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 28, color: "#7d767f" }}>
          Auckland, New Zealand · 9 years of product design
        </div>
      </div>
    ),
    size,
  );
}
