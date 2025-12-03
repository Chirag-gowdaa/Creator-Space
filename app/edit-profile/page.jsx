"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Camera, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    category: "Other",
    profilePic: "",
    coverPic: "",
    isCreator: false,
    socialLinks: {
      twitter: "",
      instagram: "",
      youtube: "",
      website: ""
    }
  });

  const categories = ["Music", "Art", "Gaming", "Writing", "Tech", "Education", "Other"];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("socialLinks.")) {
      const field = name.split(".")[1];
      setProfile({
        ...profile,
        socialLinks: {
          ...profile.socialLinks,
          [field]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-zinc-800 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-bold">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Tell your supporters about yourself..."
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={profile.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isCreator"
                    checked={profile.isCreator}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">I'm a Creator (Enable monetization)</span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Images</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Profile Picture URL</label>
                  <input
                    type="url"
                    name="profilePic"
                    value={profile.profilePic}
                    onChange={handleChange}
                    placeholder="https://example.com/profile.jpg"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {profile.profilePic && (
                    <div className="mt-3 w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-700">
                      <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Cover Picture URL</label>
                  <input
                    type="url"
                    name="coverPic"
                    value={profile.coverPic}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {profile.coverPic && (
                    <div className="mt-3 w-full h-32 rounded-lg overflow-hidden border-2 border-zinc-700">
                      <img src={profile.coverPic} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Social Links</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Twitter Handle</label>
                  <input
                    type="text"
                    name="socialLinks.twitter"
                    value={profile.socialLinks.twitter}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Instagram Handle</label>
                  <input
                    type="text"
                    name="socialLinks.instagram"
                    value={profile.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">YouTube Channel</label>
                  <input
                    type="text"
                    name="socialLinks.youtube"
                    value={profile.socialLinks.youtube}
                    onChange={handleChange}
                    placeholder="@channel"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Website</label>
                  <input
                    type="url"
                    name="socialLinks.website"
                    value={profile.socialLinks.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfile;
