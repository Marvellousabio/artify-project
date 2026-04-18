import { ImageResponse } from "next/og";
export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Artify - Revolutionizing Graphic Design";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            padding: "40px 60px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            A
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#14b8a6",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
