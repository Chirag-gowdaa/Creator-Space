"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
const ProfileForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        profilepic: "",
        coverpic: "",
    });

    const { data: session, update } = useSession();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, username, name, profilepic, coverpic } = formData;

        if (!email || !username || !name) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, name, profilePic: profilepic, coverPic: coverpic }),
            });

            const result = await res.json();
            console.log(result);

            if (!res.ok) {
                alert(result.message || "Failed to save profile. Try again!");
                return;
            }

            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: username,
                    email,
                    image: profilepic,
                },
            });

            alert("Profile Saved Successfully!");
        } catch (err) {
            console.error("Save Profile Error:", err);
            alert("Something went wrong. Please try again.");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center text-white">
            <Link href="/profile">
                <button
                    className="fixed top-4 left-4 z-50 p-3 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition"
                    style={{ position: "absolute", top: "90px", left: "20px" }}
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
            </Link>

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-8 rounded-2xl border border-white/10 shadow-lg shadow-black/40 w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold tracking-widest text-gray-200 text-center">
                    Create Your Profile
                </h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                <input
                    type="text"
                    name="profilepic"
                    placeholder="Profile Picture URL"
                    value={formData.profilepic}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                <input
                    type="text"
                    name="coverpic"
                    placeholder="Cover Picture URL"
                    value={formData.coverpic}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                />

                <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold transition
                        bg-gradient-to-br from-zinc-800 via-zinc-900 to-black
                        hover:from-zinc-700 hover:via-zinc-800 hover:to-zinc-900
                        border border-white/10 shadow-md shadow-black/40
                        text-white relative overflow-hidden group"
                        onClick={() => toast.success('Profile Updated Successfully!')}
                >
                    <span className="relative z-10">Save Profile</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></span>
                </button>
            </form>
        </div>
    );
};

export default ProfileForm;
