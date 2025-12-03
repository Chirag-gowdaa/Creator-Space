"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { BarChart3, Users, DollarSign, Heart, MessageSquare, TrendingUp, Plus } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    image: "",
    isExclusive: false,
    requiredTier: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDashboardStats();
    }
  }, [session]);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm)
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Post created successfully!");
        setPostForm({ title: "", content: "", image: "", isExclusive: false, requiredTier: "" });
        setShowPostModal(false);
        fetchDashboardStats();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <p className="text-white text-xl">Loading dashboard...</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-gray-400">Welcome back, {session.user.name}!</p>
            </div>
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Create Post
            </button>
          </div>

          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Total Earnings */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-semibold">Total Earnings</h3>
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold">${stats.totalEarnings}</p>
                <p className="text-sm text-gray-500 mt-2">From {stats.totalSupports} supporters</p>
              </div>

              {/* Followers */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-semibold">Followers</h3>
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{stats.followers}</p>
                <p className="text-sm text-gray-500 mt-2">Community size</p>
              </div>

              {/* Posts */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-semibold">Posts</h3>
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{stats.postsCount}</p>
                <p className="text-sm text-gray-500 mt-2">Total published</p>
              </div>

              {/* Engagement */}
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-semibold">Engagement</h3>
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold">{stats.totalLikes + stats.totalComments}</p>
                <p className="text-sm text-gray-500 mt-2">Likes & comments</p>
              </div>
            </div>
          )}

          {/* Recent Supporters */}
          {stats && stats.recentPayments.length > 0 && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 mb-12">
              <h2 className="text-2xl font-bold mb-6">Recent Supporters</h2>
              <div className="space-y-4">
                {stats.recentPayments.map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                    <div>
                      <p className="font-semibold">{payment.name || "Anonymous"}</p>
                      <p className="text-sm text-gray-400">{payment.message || "No message"}</p>
                    </div>
                    <p className="text-lg font-bold text-green-500">₹{payment.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/info"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition text-center"
            >
              <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
              <p className="text-gray-400">Update your bio, links, and profile picture</p>
            </a>
            <a
              href="/explore"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition text-center"
            >
              <h3 className="text-xl font-bold mb-2">Explore Creators</h3>
              <p className="text-gray-400">Discover and support other creators</p>
            </a>
            <a
              href={`/${session.user.name}`}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-blue-500 transition text-center"
            >
              <h3 className="text-xl font-bold mb-2">View Public Profile</h3>
              <p className="text-gray-400">See how your profile looks to others</p>
            </a>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-800 rounded-xl max-w-2xl w-full p-6 border border-zinc-700">
            <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder="Post Title"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Post Content"
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                required
                rows="6"
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={postForm.image}
                onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={postForm.isExclusive}
                  onChange={(e) => setPostForm({ ...postForm, isExclusive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-white">Exclusive to subscribers</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Publish Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
