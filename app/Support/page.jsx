"use client";
import React from "react";
import { Mail, Instagram, Github, Linkedin } from "lucide-react";

const Page = () => {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-6 py-12">

            {/* Profile Section */}
            <div className="bg-black/40 p-8 rounded-2xl shadow-xl max-w-2xl w-full text-center backdrop-blur-md">
                <img
                    src="/me.jpg"
                    alt="Your Name"
                    className="w-36 h-36 rounded-full mx-auto border border-gray-500 shadow-md object-cover hover:scale-105 transition-transform duration-300"
                />

                {/* About Text */}
                <h1 className="text-3xl font-bold mt-6">Hi, I'm Chirag S</h1>
                <p className="text-gray-300 mt-3 text-lg">
                    I'm a passionate <span className="text-white font-semibold">Full Stack Developer </span>
                    building modern web apps with React, Next.js, and Node.js.
                    Beyond coding, I create engaging content and stay consistent in the gym,
                    always striving to improve myself personally and professionally.
                </p>

                {/* Contact Section */}
                <h2 className="text-xl font-semibold mt-6">Connect with me</h2>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="mailto:your@email.com" target="_blank" rel="noopener noreferrer">
                        <Mail className="w-6 h-6 hover:text-blue-300 transition-all" />
                    </a>
                    <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-6 h-6 hover:text-pink-400 transition-all" />
                    </a>
                    <a href="https://github.com/Chirag-gowdaa" target="_blank" rel="noopener noreferrer">
                        <Github className="w-6 h-6 hover:text-gray-300 transition-all" />
                    </a>
                    <a href="https://www.linkedin.com/in/chirag-gowda-b10570351/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-6 h-6 hover:text-blue-500 transition-all" />
                    </a>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3" style={{ marginTop: "20px" }}>Github Code</h3>
                <a
                    href="https://github.com/yourusername/yourproject"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 rounded-full bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors duration-300"
                >
                    View on GitHub
                </a>


            </div>
        </div>
    );
};

export default Page;
