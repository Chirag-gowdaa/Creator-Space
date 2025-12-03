"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Heart, Users, TrendingUp, Search } from "lucide-react";
import toast from "react-hot-toast";

const ExplorePage = () => {
  const { data: session } = useSession();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [following, setFollowing] = useState(new Set());

  const categories = ["All", "Music", "Art", "Gaming", "Writing", "Tech", "Education"];

  useEffect(() => {
    fetchCreators();
  }, [category, search, page]);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.append("category", category);
      if (search) params.append("search", search);
      params.append("page", page);

      const res = await fetch(`/api/creators?${params}`);
      const data = await res.json();

      if (data.success) {
        setCreators(data.creators);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Failed to load creators");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (creatorId) => {
    if (!session) {
      toast.error("Please sign in to follow creators");
      return;
    }

    try {
      const isFollowing = following.has(creatorId);
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: creatorId,
          action: isFollowing ? "unfollow" : "follow"
        })
      });

      const data = await res.json();
      if (data.success) {
        const newFollowing = new Set(following);
        if (isFollowing) {
          newFollowing.delete(creatorId);
        } else {
          newFollowing.add(creatorId);
        }
        setFollowing(newFollowing);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error following creator:", error);
      toast.error("Failed to follow creator");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <Navbar />

      <div className="pt-24 px-4 md:px-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Creators</h1>
          <p className="text-gray-400 text-lg">Find and support amazing creators across different categories</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search creators by name or bio..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        <div className="max-w-7xl mx-auto mb-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading creators...</p>
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No creators found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <div
                  key={creator._id}
                  className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden hover:border-blue-500 transition group"
                >
                  {/* Profile Image */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
                    {creator.profilePic && (
                      <Image
                        src={creator.profilePic}
                        alt={creator.name}
                        fill
                        className="object-cover group-hover:scale-110 transition"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{creator.name}</h3>
                    <p className="text-blue-400 text-sm mb-3">@{creator.username}</p>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{creator.bio || "No bio yet"}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-zinc-700 rounded-lg p-2">
                        <div className="text-lg font-bold">{creator.followers?.length || 0}</div>
                        <div className="text-xs text-gray-400">Followers</div>
                      </div>
                      <div className="bg-zinc-700 rounded-lg p-2">
                        <div className="text-lg font-bold">${creator.totalEarnings || 0}</div>
                        <div className="text-xs text-gray-400">Earned</div>
                      </div>
                      <div className="bg-zinc-700 rounded-lg p-2">
                        <div className="text-lg font-bold">{creator.totalSupports || 0}</div>
                        <div className="text-xs text-gray-400">Supports</div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-block bg-blue-900 text-blue-200 text-xs px-3 py-1 rounded-full">
                        {creator.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/${creator.username}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-center"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => handleFollow(creator._id)}
                        className={`flex-1 font-semibold py-2 rounded-lg transition ${
                          following.has(creator._id)
                            ? "bg-zinc-700 text-white hover:bg-zinc-600"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                      >
                        {following.has(creator._id) ? "Following" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto mb-12 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ExplorePage;
