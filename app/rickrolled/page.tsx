"use client";

export default function RickRolled() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "bounce 1s ease-in-out",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>🎵</div>
        <h1
          style={{
            fontSize: "48px",
            margin: "0 0 20px 0",
            color: "#667eea",
            fontWeight: "bold",
          }}
        >
          Nice Try! 😂
        </h1>
        <p
          style={{
            fontSize: "24px",
            margin: "0 0 30px 0",
            color: "#666",
          }}
        >
          Were you looking for credentials? 🔐
        </p>
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              fontSize: "18px",
              margin: 0,
              color: "#333",
              fontStyle: "italic",
            }}
          >
            "Never gonna give you up
            <br />
            Never gonna let you down
            <br />
            Never gonna run around and desert you..."
          </p>
        </div>
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: "10px", marginBottom: "20px" }}
        />
        <p
          style={{
            fontSize: "16px",
            color: "#999",
            margin: 0,
          }}
        >
          🚨 Security Alert: Unauthorized access attempt detected 🚨
        </p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
