"use client"
import React, { useState, useEffect } from "react";
import Navbar from "../app/components/Navbar";
import Footer from "../app/components/Footer";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%" }}>
      {/* Spline Background */}
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

      {/* Foreground Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "calc(100vh - 80px)",
          padding: isMobile ? "20px" : "0 50px",
          color: "white",
          zIndex: 1,
          position: "relative",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Left Side Text */}
        <div
          style={{
            maxWidth: isMobile ? "100%" : "30%",
            textAlign: isMobile ? "center" : "left",
            marginBottom: isMobile ? "30px" : "0",
            marginTop: isMobile ? "50px" : "0",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
            Collaborate & Create
          </h1>
          <p style={{ color: "#ccc", marginBottom: "15px" }}>
            Space where all creators gather, share ideas, and work together.
          </p>

          <div
            style={{
              position: "relative",
              width: isMobile ? "100%" : "300px",
              margin: "0 auto",
            }}
          >
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                color: "#aaa",
              }}
            />
            <input
              type="search"
              placeholder="Search creators..."
              style={{
                width: "100%",
                padding: "10px 10px 10px 35px",
                borderRadius: "8px",
                border: '1px solid #8c8c8c',
                backgroundColor: "#222",
                color: '#bfbfbf',
                outline: "none",
                fontSize: "0.9rem",
                fontWeight: '600',
                boxShadow: '0 0 8px rgba(160, 160, 160, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#bfbfbf';
                e.target.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#222';
                e.target.style.color = '#bfbfbf';
              }}
            />
          </div>
        </div>

        {/* Right Side Text */}
        <div
          style={{
            maxWidth: isMobile ? "100%" : "30%",
            textAlign: isMobile ? "center" : "right",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
            Join the Movement
          </h1>
          <p style={{ color: "#ccc", paddingBottom: '20px' }}>
            Sign up today and be a part of the future of creative collaboration.
          </p>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "10px",
            justifyContent: isMobile ? "center" : "flex-end"
          }}>
            <a
              href="/signup"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #a8a8a8',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#d0d0d0',
                fontWeight: '600',
                boxShadow: '0 0 8px rgba(180, 180, 180, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#d0d0d0';
                e.target.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#d0d0d0';
              }}
            >
              Sign Up
            </a>

            <a
              href="/read"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #8c8c8c',
                borderRadius: '6px',
                textDecoration: 'none',
                color: '#bfbfbf',
                fontWeight: '600',
                boxShadow: '0 0 8px rgba(160, 160, 160, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#bfbfbf';
                e.target.style.color = '#1a1a1a';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#bfbfbf';
              }}
            >
              Read More
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
