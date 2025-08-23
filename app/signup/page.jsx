"use client";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const buttonStyle = {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  };

  const buttonHoverColors = {
    github: "#171a1d",
    google: "#e0e0e0",
    meta: "#155db2",
    linkedin: "#004182",
  };

  return (
    <>
      <div>
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

        <a
          href="/"
          className="underline text-gray-500 hover:text-amber-50 transition"
          style={{
            position: "absolute",
            top: "100px",
            left: "30px",
            textDecoration: "underline",
            zIndex: 10,
          }}
        >
          back
        </a>

        <div
          style={{
            color: "white",
            textAlign: "center",
            paddingTop: "100px",
          }}
        >
          <h1 className="text-3xl font-bold mb-4">Sign Up to YourSpace</h1>
          <p style={{ marginBottom: "20px", color: "#aaa" }}>
            Choose your preferred sign-up method
          </p>

          <div
            className="buttons"
            style={{
              display: "grid",
              justifyContent: "center",
              alignContent: "center",
              gap: "15px",
            }}
          >
            {/* GitHub */}
            <button
              onClick={() => signIn("github")}
              style={{ ...buttonStyle, background: "#24292f", color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = buttonHoverColors.github)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#24292f")
              }
            >
              <img
                src="/github-icon.png"
                alt="GitHub"
                style={{ width: "18px", height: "18px" }}
              />
              Continue with GitHub
            </button>

            {/* Google */}
            <button
              onClick={() => signIn("google")}
              style={{
                ...buttonStyle,
                background: "white",
                color: "#555",
                border: "1px solid #ccc",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = buttonHoverColors.google)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "white")
              }
            >
              <img
                src="/google-icon.png"
                alt="Google"
                style={{ width: "18px", height: "18px" }}
              />
              Continue with Google
            </button>

            {/* Meta */}
            <button
              onClick={() => signIn("facebook")}
              style={{ ...buttonStyle, background: "#1877F2", color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = buttonHoverColors.meta)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#1877F2")
              }
            >
              <img
                src="/meta-icon.png"
                alt="Meta"
                style={{ width: "18px", height: "18px", filter: "invert(2)" }}
              />
              Continue with Meta
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => signIn("linkedin")}
              style={{ ...buttonStyle, background: "#0A66C2", color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = buttonHoverColors.linkedin)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#0A66C2")
              }
            >
              <img
                src="/linkedin.png"
                alt="LinkedIn"
                style={{ width: "18px", height: "18px" }}
              />
              Continue with LinkedIn
            </button>

            <p>
              <a
                href="#"
                className="underline text-gray-500 hover:text-amber-50 transition"
              >
                Continue without an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
