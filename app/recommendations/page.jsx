'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Lightbulb, Users, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/recommendations?limit=20');
      const data = await res.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      toast.error('Failed to load recommendations');
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
          <Lightbulb className="text-yellow-500" size={32} />
          <h1 className="text-4xl font-bold text-white">Recommended For You</h1>
        </div>

        <p className="text-zinc-400 mb-8">
          Discover amazing creators based on your interests
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-white" size={40} />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No recommendations available yet</p>
            <Link href="/explore">
              <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Explore All Creators
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(creator => (
              <div
                key={creator._id}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg overflow-hidden hover:from-zinc-750 hover:to-zinc-850 transition group"
              >
                {/* Header Background */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition" />

                {/* Content */}
                <div className="p-6 -mt-8 relative">
                  {/* Profile Image */}
                  <img
                    src={creator.profilePic || '/default-avatar.png'}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full border-4 border-zinc-800 object-cover mb-4"
                  />

                  {/* Creator Info */}
                  <Link href={`/creator-profile?username=${creator.username}`}>
                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition cursor-pointer">
                      {creator.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-zinc-400">@{creator.username}</p>

                  {/* Category Badge */}
                  <div className="mt-3 inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                    {creator.category}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-zinc-300 mt-3 line-clamp-3">
                    {creator.bio || 'No bio yet'}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Users size={16} />
                      <span className="font-semibold">{creator.followers.length}</span>
                      <span>followers</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <span className="font-semibold">₹{creator.totalEarnings}</span>
                      <span>earned</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-6">
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
                    <Link href={`/creator-profile?username=${creator.username}`} className="flex-1">
                      <button className="w-full py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition font-semibold">
                        View Profile
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {recommendations.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={fetchRecommendations}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
            >
              Get More Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
