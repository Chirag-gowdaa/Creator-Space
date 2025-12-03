'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Search, Users, FileText, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SearchPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const type = activeTab === 'all' ? 'all' : activeTab;
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=${type}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators, posts..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {results ? (
          <>
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-zinc-700">
              {['all', 'creators', 'posts'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    performSearch(searchQuery);
                  }}
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

            {/* Results */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="animate-spin text-white" size={40} />
              </div>
            ) : results.total === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400 text-lg">No results found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Creators Results */}
                {(activeTab === 'all' || activeTab === 'creators') && results.creators?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users size={20} /> Creators ({results.creatorCount})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {results.creators.map(creator => (
                        <div key={creator._id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition">
                          <Link href={`/creator-profile?username=${creator.username}`}>
                            <div className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80">
                              <img
                                src={creator.profilePic || '/default-avatar.png'}
                                alt={creator.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-white">{creator.name}</p>
                                <p className="text-sm text-zinc-400">@{creator.username}</p>
                              </div>
                            </div>
                          </Link>
                          <p className="text-sm text-zinc-300 mb-3 line-clamp-2">{creator.bio}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-zinc-400">{creator.followers.length} followers</span>
                            <span className="text-sm text-green-400">₹{creator.totalEarnings}</span>
                          </div>
                          <button
                            onClick={() => handleFollow(creator._id)}
                            className={`w-full py-2 rounded-lg font-semibold transition ${
                              following.has(creator._id)
                                ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {following.has(creator._id) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posts Results */}
                {(activeTab === 'all' || activeTab === 'posts') && results.posts?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <FileText size={20} /> Posts ({results.postCount})
                    </h2>
                    <div className="space-y-4">
                      {results.posts.map(post => (
                        <div key={post._id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition">
                          <Link href={`/creator-profile?username=${post.creator.username}`}>
                            <div className="flex items-center gap-3 mb-3 cursor-pointer hover:opacity-80">
                              <img
                                src={post.creator.profilePic || '/default-avatar.png'}
                                alt={post.creator.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-white">{post.creator.name}</p>
                                <p className="text-sm text-zinc-400">@{post.creator.username}</p>
                              </div>
                            </div>
                          </Link>
                          <h3 className="text-lg font-bold text-white mb-2">{post.title}</h3>
                          <p className="text-zinc-300 mb-3">{post.content.substring(0, 150)}...</p>
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <div className="flex gap-4 text-sm text-zinc-400">
                            <span>❤️ {post.likeCount}</span>
                            <span>💬 {post.commentCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="mx-auto mb-4 text-zinc-400" size={48} />
            <p className="text-zinc-400 text-lg">Start searching to find creators and posts</p>
          </div>
        )}
      </div>
    </div>
  );
}
