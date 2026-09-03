import { ImageResponse } from "next/og";

export const alt = "GTM Audit · Markoholics — The 14-Day Signal Sprint, $499";
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
            color: "#01A6C8",
            textTransform: "uppercase",
            letterSpacing: 6,
            marginBottom: 24,
            display: "flex",
          }}
        >
          MARKOHOLICS · AI-NATIVE GTM
        </div>
        <div
          style={{
            fontSize: 68,
            color: "#FFFFFF",
            lineHeight: 1.1,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          Still manual-testing your GTM in 2026?
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#D6FE4E",
            fontWeight: 700,
            marginTop: 40,
            display: "flex",
          }}
        >
          The 14-Day Signal Sprint · $499
        </div>
      </div>
    ),
    { ...size }
  );
}
