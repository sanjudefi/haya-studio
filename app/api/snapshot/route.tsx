import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

interface SnapshotRequest {
  studioName: string;
  date: string;
  instructors: Array<{
    name: string;
    specialization: string;
    avatarUrl?: string;
    statusText: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body: SnapshotRequest = await request.json();
    const { studioName, date, instructors } = body;

    // Empty state if no instructors available
    if (instructors.length === 0) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
              padding: "60px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              {studioName}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#14b8a6",
                fontWeight: "600",
                marginBottom: "60px",
              }}
            >
              {date}
            </div>
            <div
              style={{
                fontSize: "32px",
                color: "#71717a",
                textAlign: "center",
              }}
            >
              No instructors available on this day
            </div>
          </div>
        ),
        {
          width: 1080,
          height: 1350,
        }
      );
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
            padding: "50px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              {studioName}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#14b8a6",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Available Instructors
            </div>
            <div
              style={{
                fontSize: "20px",
                color: "#a1a1aa",
              }}
            >
              {date}
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "3px",
              background: "linear-gradient(90deg, #14b8a6 0%, #0d9488 100%)",
              marginBottom: "35px",
              borderRadius: "2px",
            }}
          />

          {/* Instructor Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "space-between",
            }}
          >
            {instructors.slice(0, 8).map((instructor, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#18181b",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "2px solid #27272a",
                  width: "450px",
                }}
              >
                {/* Avatar */}
                <img
                  src={instructor.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt={instructor.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "4px solid #14b8a6",
                    marginBottom: "16px",
                    objectFit: "cover",
                  }}
                />

                {/* Name */}
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#ffffff",
                    marginBottom: "6px",
                    textAlign: "center",
                  }}
                >
                  {instructor.name}
                </div>

                {/* Specialization */}
                <div
                  style={{
                    fontSize: "16px",
                    color: "#14b8a6",
                    marginBottom: "12px",
                    textAlign: "center",
                  }}
                >
                  {instructor.specialization}
                </div>

                {/* Available Hours */}
                <div
                  style={{
                    fontSize: "15px",
                    color: "#a1a1aa",
                    textAlign: "center",
                    padding: "8px 12px",
                    backgroundColor: "#27272a",
                    borderRadius: "8px",
                  }}
                >
                  {instructor.statusText}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: "30px",
              fontSize: "14px",
              color: "#52525b",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Generated by Haya Studio Demo • {instructors.length} instructor
            {instructors.length !== 1 ? "s" : ""} available
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
      }
    );
  } catch (error) {
    console.error("Error generating snapshot:", error);
    return new Response("Error generating snapshot", { status: 500 });
  }
}
