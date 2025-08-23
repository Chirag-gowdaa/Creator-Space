"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/");
    return null; // don't render anything while redirecting
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Spline iframe background */}
      <iframe
        src="https://my.spline.design/logoreveal-wiJaiQcrfYUZZAup1SVDMDOa/"
        frameBorder="0"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      ></iframe>

      {/* Centered content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Photo + Name in one line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(0,0,0,0.7)",
          }}
        >
          <Image
            src={session.user.image}
            alt="Profile picture"
            width={40}
            height={40}
            style={{ borderRadius: "50%" }}
          />
          <span>Welcome, {session.user?.name}</span>
        </div>

        {/* Dashboard link */}
        <div style={{ marginTop: "0.5rem" }}>
          <Link
            href={`${session.user.name}`}
            style={{
              fontSize: "0.9rem",
              textDecoration: "underline",
              color: "#bfbfbf",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#fff")}
            onMouseLeave={(e) => (e.target.style.color = "#bfbfbf")}
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
