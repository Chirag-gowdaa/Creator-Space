'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, MessageCircle, Users, TrendingUp, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function TrendingPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('creators');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    fetchTrending();
  }, [activeTab]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trending?type=${activeTab}`);
      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      toast.error('Failed to load trending');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    if (!session) {
      toast.error('Please sign in to follow');
      return;
    }

    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: userId,
          action: following.has(userId) ? 'unfollow' : 'follow'
        })
      });

      const result = await res.json();
      if (result.success) {
        if (following.has(userId)) {
          setFollowing(prev => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        } else {
          setFollowing(prev => new Set(prev).add(userId));
        }
        toast.success(result.message);
      }
    } catch (error) {
      toast.error('Failed to follow');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-red-500" size={32} />
          <h1 className="text-4xl font-bold text-white">Trending</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-zinc-700">
          {['creators', 'posts', 'categories'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === tab
                  ? 'text-white border-blue-500'
                  : 'text-zinc-400 border-transparent hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white" size={40} />
          </div>
        ) : (
          <div>
            {activeTab === 'creators' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map(creator => (
                  <div key={creator._id} className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600" />
                    <div className="p-4 -mt-8 relative">
                      <img
                        src={creator.profilePic || '/default-avatar.png'}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full border-4 border-zinc-800 object-cover"
                      />
                      <Link href={`/creator-profile?username=${creator.username}`}>
                        <h3 className="text-lg font-bold text-white mt-3 hover:text-blue-400">{creator.name}</h3>
                      </Link>
                      <p className="text-sm text-zinc-400">@{creator.username}</p>
                      <p className="text-sm text-zinc-300 mt-2 line-clamp-2">{creator.bio}</p>

                      <div className="flex gap-4 mt-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Users size={16} /> {creator.followers.length}
                        </span>
                        <span className="flex items-center gap-1">
                          💰 ₹{creator.totalEarnings}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleFollow(creator._id)}
                          className={`flex-1 py-2 rounded-lg font-semibold transition ${
                            following.has(creator._id)
                              ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {following.has(creator._id) ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-6">
                {data.map(post => (
                  <div key={post._id} className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition">
                    <div className="p-6">
                      <Link href={`/creator-profile?username=${post.creator.username}`}>
                        <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80">
                          <img
                            src={post.creator.profilePic || '/default-avatar.png'}
                            alt={post.creator.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-white">{post.creator.name}</p>
                            <p className="text-sm text-zinc-400">@{post.creator.username}</p>
                          </div>
                        </div>
                      </Link>

                      <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                      <p className="text-zinc-300 mb-4">{post.content.substring(0, 200)}...</p>

                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <div className="flex gap-6 text-sm text-zinc-400">
                        <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer">
                          <Heart size={16} /> {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer">
                          <MessageCircle size={16} /> {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((category, idx) => (
                  <div key={idx} className="bg-zinc-800 rounded-lg p-6 hover:bg-zinc-750 transition">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{category._id}</h3>
                      <TrendingUp className="text-green-500" size={24} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-zinc-300">
                        <span className="font-semibold">{category.count}</span> creators
                      </p>
                      <p className="text-zinc-300">
                        <span className="font-semibold">{category.totalFollowers}</span> total followers
                      </p>
                    </div>
                    <Link href={`/explore?category=${category._id}`}>
                      <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        Explore
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
