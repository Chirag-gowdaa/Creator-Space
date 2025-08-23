"use client"
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  const linkStyle = {
    color: '#cfcfcf',
    textDecoration: 'none',
    fontWeight: 500,
    letterSpacing: '0.5px',
    transition: 'all 0.25s ease',
  };

  const onEnter = (e) => {
    e.target.style.color = '#e5e5e5';
    e.target.style.textShadow = '0 0 6px rgba(210,210,210,0.7)';
  };

  const onLeave = (e) => {
    e.target.style.color = '#cfcfcf';
    e.target.style.textShadow = 'none';
  };

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        background: 'linear-gradient(90deg, rgba(15,15,15,0.7), rgba(40,40,40,0.7))',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(200,200,200,0.15)',
        boxShadow: '0 0 12px rgba(180,180,180,0.18)',
        color: '#d1d1d1',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              height: 22,
              width: 22,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4a4a4a, #8a8a8a)',
              boxShadow: '0 0 8px rgba(190,190,190,0.5)',
            }}
          />
          <span style={{ letterSpacing: '1.5px', fontWeight: 700 }}>YOURSPACE</span>
          <span style={{ opacity: 0.6, fontSize: 12, marginLeft: 8 }}>© {year}</span>
        </div>

        {/* Right: links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="#terms" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Terms
          </a>
          <a href="#privacy" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Privacy
          </a>
          <a href="#status" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Status
          </a>
          <a href="#contact" style={linkStyle} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
