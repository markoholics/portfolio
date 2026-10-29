import { ImageResponse } from "next/og";

export const alt = "Markoholics Roundtable Series.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#000000",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: "#00D4FF",
            textTransform: "uppercase",
            letterSpacing: 6,
            marginBottom: 24,
            display: "flex",
          }}
        >
          MARKOHOLICS
        </div>
        <div
          style={{
            fontSize: 72,
            color: "#FFFFFF",
            lineHeight: 1.1,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          Roundtable <span style={{ color: "#00D4FF", marginLeft: 20, display: "flex" }}>Series.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#D9D9D9",
            marginTop: 32,
            maxWidth: 900,
            display: "flex",
          }}
        >
          GTM and marketing conversations for tech, AI and SaaS founders.
        </div>
      </div>
    ),
    { ...size }
  );
}
