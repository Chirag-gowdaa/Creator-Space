"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import NewsNavBar from "./NewsNavBar";
const Navbar = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false); // Profile dropdown
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background:
          "linear-gradient(90deg, rgba(15,15,15,0.7), rgba(40,40,40,0.7))",
        backdropFilter: "blur(10px)",
        color: "#e0e0e0",
        zIndex: 50,
        borderBottom: "1px solid rgba(200, 200, 200, 0.15)",
        boxShadow: "0 0 15px rgba(180, 180, 180, 0.2)",
      }}
    >
      {/* Logo */}
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: "#d1d1d1",
          textShadow: "0 0 8px rgba(200, 200, 200, 0.8)",
        }}
      >
        <a href="/">YOURSPACE</a>
      </h1>

      {/* Desktop Links */}
      {!isMobile && !session && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
         {/* <a href="/News" className="hover-glow">What's New<span className="absolute -top-1 -right-3 h-2 w-2 border-gray-500 rounded-full"></span></a> */}
         <NewsNavBar />
          <a href="/About" className="hover-glow">About</a>
          <a href="/Support" className="hover-glow">Support</a>
          <a href="/more" className="hover-glow">More</a>

          {/* SignUp/Login remain unchanged */}
          <a
            href="/signup"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #a8a8a8",
              borderRadius: "6px",
              textDecoration: "none",
              color: "#d0d0d0",
              fontWeight: "600",
              boxShadow: "0 0 8px rgba(180, 180, 180, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#bfbfbf";
              e.target.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#bfbfbf";
            }}
          >
            Sign Up
          </a>

          <a
            href="/signup"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #8c8c8c",
              borderRadius: "6px",
              textDecoration: "none",
              color: "#bfbfbf",
              fontWeight: "600",
              boxShadow: "0 0 8px rgba(160, 160, 160, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#bfbfbf";
              e.target.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#bfbfbf";
            }}
          >
            Login
          </a>
        </div>
      )}

      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 60,
          }}
        >
          <div style={{ width: "25px", height: "2px", background: "#e0e0e0", margin: "5px 0" }} />
          <div style={{ width: "25px", height: "2px", background: "#e0e0e0", margin: "5px 0" }} />
          <div style={{ width: "25px", height: "2px", background: "#e0e0e0", margin: "5px 0" }} />
        </button>
      )}

      {/* Mobile Slide Menu */}
      {menuOpen && isMobile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "#111",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            zIndex: 55,
            transition: "all 0.3s ease",
          }}
        >
          {/* Exit Button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              fontSize: "2rem",
              color: "#fff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          <a href="/News" className="hover-glow" onClick={() => setMenuOpen(false)}>
            What's New
          </a>
          <a href="/About" className="hover-glow" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="/Support" className="hover-glow" onClick={() => setMenuOpen(false)}>
            Support
          </a>
          <a href="/more" className="hover-glow" onClick={() => setMenuOpen(false)}>
            More
          </a>
          {/* SignUp/Login buttons can also go here if desired */}
          <a
            href="/signup"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #a8a8a8",
              borderRadius: "6px",
              textDecoration: "none",
              color: "#d0d0d0",
              fontWeight: "600",
              boxShadow: "0 0 8px rgba(180, 180, 180, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#bfbfbf";
              e.target.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#bfbfbf";
            }}
          >
            Sign Up
          </a>

          <a
            href="/signup"
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #8c8c8c",
              borderRadius: "6px",
              textDecoration: "none",
              color: "#bfbfbf",
              fontWeight: "600",
              boxShadow: "0 0 8px rgba(160, 160, 160, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#bfbfbf";
              e.target.style.color = "#1a1a1a";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#bfbfbf";
            }}
          >
            Login
          </a>
        </div>
      )}
      {/* </div>
  )
} */}

      {session && (
        <div
          className={`flex ${isMobile
            ? "flex-col items-center w-full gap-3 text-center"
            : "flex-row items-center gap-8"
            }`}
        >
          {/* Navigation Links */}
          {!isMobile && (
            <div className="flex gap-4">
              <a href="/explore" className="text-gray-300 hover:text-white transition font-semibold">Explore</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition font-semibold">Dashboard</a>
            </div>
          )}

          {/* Search Input */}
          <input
            type="search"
            placeholder="Search creators..."
            className="w-full sm:w-52 px-4 py-3 rounded-lg border border-gray-600 bg-[#222] text-gray-300 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.5rem 1rem",
                border: "1px solid #8c8c8c",
                borderRadius: "6px",
                background: "transparent",
                color: "#bfbfbf",
                fontWeight: "600",
                boxShadow: "0 0 8px rgba(160, 160, 160, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#bfbfbf";
                e.currentTarget.style.color = "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#bfbfbf";
              }}
            >
              Profile
              <Image
                src="/down.png"
                height={20}
                width={20}
                alt="down arrow"
                className={`transition-transform ${open ? "rotate-180" : ""
                  } invert`}
              />
            </button>

            {open && (
              <div className="absolute mt-2 w-40 bg-[#1e1e1e] border border-gray-700 rounded-md shadow-lg z-20">
                {[
                  { name: "Dashboard", link: `/dashboard` },
                  { name: "Edit Profile", link: "/edit-profile" },
                  { name: "View Profile", link: `/${session.user.name}` },
                  { name: "About", link: "/About" },
                  { name: "Support", link: "/Support" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className="block px-4 py-2 hover:bg-gray-700 transition"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/delete"
                  className="block px-4 py-2 text-red-400 hover:bg-gray-700 transition"
                >
                  Delete Account
                </Link>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          >
            <a
              style={{
                padding: "0.7rem 1rem",
                border: "1px solid #8c8c8c",
                borderRadius: "6px",
                textDecoration: "none",
                color: "#bfbfbf",
                fontWeight: "600",
                boxShadow: "0 0 8px rgba(160, 160, 160, 0.4)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#bfbfbf";
                e.target.style.color = "#1a1a1a";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#bfbfbf";
              }}
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            >
              Logout
            </a>
          </button>
        </div>
      )}

    </nav >
  );
};

export default Navbar;
