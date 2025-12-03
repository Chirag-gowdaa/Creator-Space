"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Heart, MessageCircle, Share2, Users, DollarSign, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const CreatorProfile = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [creator, setCreator] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    if (username) {
      fetchCreatorData();
    }
  }, [username]);

  const fetchCreatorData = async () => {
    try {
      // Fetch creator info and posts
      const creatorRes = await fetch(`/api/creators?search=${username}`);
      const creatorData = await creatorRes.json();

      if (creatorData.success && creatorData.creators.length > 0) {
        const creatorInfo = creatorData.creators[0];
        setCreator(creatorInfo);

        // Fetch posts
        const postsRes = await fetch(`/api/posts?creatorId=${creatorInfo._id}`);
        const postsData = await postsRes.json();
        if (postsData.success) {
          setPosts(postsData.posts);
        }
      }
    } catch (error) {
      console.error("Error fetching creator data:", error);
      toast.error("Failed to load creator profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session) {
      toast.error("Please sign in to follow creators");
      return;
    }

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: creator._id,
          action: isFollowing ? "unfollow" : "follow"
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error following creator:", error);
      toast.error("Failed to follow creator");
    }
  };

  const handleLikePost = async (postId) => {
    if (!session) {
      toast.error("Please sign in to like posts");
      return;
    }

    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
        <Navbar />
        <div className="pt-24 flex items-center justify-center h-96">
          <p className="text-xl">Creator not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      <Navbar />

      <div className="pt-24 pb-12">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-br from-blue-600 to-purple-600 relative">
          {creator.coverPic && (
            <Image
              src={creator.coverPic}
              alt="Cover"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 -mt-20 relative z-10 mb-12">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800">
                {creator.profilePic && (
                  <Image
                    src={creator.profilePic}
                    alt={creator.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 flex flex-col justify-end">
              <h1 className="text-4xl font-bold mb-2">{creator.name}</h1>
              <p className="text-blue-400 text-lg mb-4">@{creator.username}</p>
              <p className="text-gray-300 mb-6 max-w-2xl">{creator.bio || "No bio yet"}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-2xl font-bold">{creator.followers?.length || 0}</p>
                  <p className="text-gray-400">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">${creator.totalEarnings || 0}</p>
                  <p className="text-gray-400">Total Earned</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{creator.totalSupports || 0}</p>
                  <p className="text-gray-400">Supporters</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    isFollowing
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <Link
                  href={`/${creator.username}`}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  Support Creator
                </Link>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {creator.socialLinks && (
            <div className="mb-12 flex gap-4">
              {creator.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${creator.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Twitter
                </a>
              )}
              {creator.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${creator.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition"
                >
                  Instagram
                </a>
              )}
              {creator.socialLinks.youtube && (
                <a
                  href={`https://youtube.com/${creator.socialLinks.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 transition"
                >
                  YouTube
                </a>
              )}
              {creator.socialLinks.website && (
                <a
                  href={creator.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-300 transition"
                >
                  Website
                </a>
              )}
            </div>
          )}

          {/* Posts Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>

            {posts.length === 0 ? (
              <div className="text-center py-12 bg-zinc-800 rounded-xl border border-zinc-700">
                <p className="text-gray-400">No posts yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden hover:border-blue-500 transition"
                  >
                    {post.image && (
                      <div className="relative h-64 bg-gradient-to-br from-blue-600 to-purple-600">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">{post.content}</p>

                      {post.isExclusive && (
                        <div className="mb-4 inline-block bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">
                          Exclusive Content
                        </div>
                      )}

                      {/* Post Stats */}
                      <div className="flex gap-6 text-gray-400 text-sm">
                        <button
                          onClick={() => handleLikePost(post._id)}
                          className={`flex items-center gap-2 transition ${
                            likedPosts.has(post._id) ? "text-red-500" : "hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${likedPosts.has(post._id) ? "fill-current" : ""}`}
                          />
                          {post.likes?.length || 0}
                        </button>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatorProfile;
