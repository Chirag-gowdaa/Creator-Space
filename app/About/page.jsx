"use client";


export default function About() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* Background */}
      <iframe
        src="https://my.spline.design/particles-exDghJkLB03GKmf9Ay0hpkMj/"
        frameBorder="0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100%",
          height: "100%",
          border: "none",
        }}
      ></iframe>
      {/* Main Content */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "6rem 1rem 3rem",
          color: "#e0e0e0",
          zIndex: 1,
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem", textShadow: "0 0 10px rgba(0,0,0,0.7)" }}>
          Welcome to YOURSPACE
        </h1>

        <p style={{ maxWidth: "700px", fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "2rem", color: "#cfcfcf" }}>
          YOURSPACE is a platform designed for creators to collaborate, share, and grow together. Whether you are an artist, developer, or content creator, YOURSPACE helps you showcase your work, connect with others, and build your audience effortlessly.
        </p>

        {/* Features Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.5rem",
            maxWidth: "900px",
          }}
        >
          {[
            { title: "Collaborate", desc: "Work together with other creators seamlessly." },
            { title: "Showcase", desc: "Display your projects and ideas to the community." },
            { title: "Connect", desc: "Find and network with like-minded people." },
            { title: "Grow", desc: "Expand your reach and gain recognition." },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                background: "rgba(30, 30, 30, 0.7)",
                padding: "1.5rem",
                borderRadius: "12px",
                minWidth: "200px",
                flex: "1 1 200px",
                boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3 style={{ fontSize: "1.4rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: "1rem", color: "#d0d0d0" }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
