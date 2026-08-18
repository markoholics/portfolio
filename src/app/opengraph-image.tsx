import { ImageResponse } from "next/og";

export const alt = "Markoholics — AI-Native GTM Partner for Tech Founders";
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
            fontSize: 40,
            color: "#D9D9D9",
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
          AI-Native GTM Engines for Tech Founders
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#8A8A8A",
            marginTop: 32,
            display: "flex",
          }}
        >
          Strategy · Content · Demand Generation · AI Operations
        </div>
      </div>
    ),
    { ...size }
  );
}
