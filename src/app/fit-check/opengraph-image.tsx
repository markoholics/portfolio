import { ImageResponse } from "next/og";
import { PRICING } from "@/lib/fit-check/config";

export const alt = "Fit Check · Markoholics — Seven questions, about ninety seconds.";
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
          MARKOHOLICS · FIT CHECK
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
          Let us find out if we are right for each other.
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#D9D9D9",
            marginTop: 32,
            display: "flex",
          }}
        >
          Seven questions, about ninety seconds.
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#00D4FF",
            fontWeight: 700,
            marginTop: 32,
            display: "flex",
          }}
        >
          Engagements start from ₹{PRICING.proofSprint.amount.toLocaleString("en-IN")}, plus GST
        </div>
      </div>
    ),
    { ...size }
  );
}
