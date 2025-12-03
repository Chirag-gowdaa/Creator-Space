'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, MessageCircle, Share2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feed?page=${page}`);
      const data = await res.json();

      if (data.success) {
        if (page === 1) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(page < data.pagination.pages);
      }
    } catch (error) {
      toast.error('Failed to load feed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          action: isLiked ? 'unlike' : 'like'
        })
      });

      const data = await res.json();
      if (data.success) {
        if (isLiked) {
          setLikedPosts(prev => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        } else {
          setLikedPosts(prev => new Set(prev).add(postId));
        }

        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, likeCount: data.totalLikes }
            : post
        ));

        toast.success(isLiked ? 'Unliked' : 'Liked!');
      }
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text || text.trim() === '') {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, text })
      });

      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(post =>
          post._id === postId
            ? { ...post, commentCount: post.commentCount + 1 }
            : post
        ));
        setCommentText(prev => ({ ...prev, [postId]: '' }));
        toast.success('Comment added!');
      }
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Feed</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No posts yet. Follow creators to see their content!</p>
            <Link href="/explore">
              <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Explore Creators
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post._id} className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-750 transition">
                {/* Post Header */}
                <div className="p-4 border-b border-zinc-700">
                  <Link href={`/creator-profile?username=${post.creator.username}`}>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80">
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
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                  <p className="text-zinc-300 mb-4">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  {post.isExclusive && (
                    <div className="inline-block px-3 py-1 bg-purple-600 text-white text-sm rounded-full mb-4">
                      🔒 Exclusive
                    </div>
                  )}
                </div>

                {/* Post Stats */}
                <div className="px-4 py-2 border-t border-zinc-700 flex gap-6 text-sm text-zinc-400">
                  <span className="hover:text-red-500 cursor-pointer">{post.likeCount} likes</span>
                  <span className="hover:text-blue-500 cursor-pointer">{post.commentCount} comments</span>
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-zinc-700 flex gap-4">
                  <button
                    onClick={() => handleLike(post._id, likedPosts.has(post._id))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      likedPosts.has(post._id)
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
                    }`}
                  >
                    <Heart size={18} fill={likedPosts.has(post._id) ? 'currentColor' : 'none'} />
                    Like
                  </button>
                  <button
                    onClick={() => setShowComments(prev => ({
                      ...prev,
                      [post._id]: !prev[post._id]
                    }))}
                    className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition"
                  >
                    <MessageCircle size={18} />
                    Comment
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[post._id] && (
                  <div className="px-4 py-4 border-t border-zinc-700 bg-zinc-900/50">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText(prev => ({
                          ...prev,
                          [post._id]: e.target.value
                        }))}
                        className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Load More */}
            {hasMore && (
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition"
              >
                {loading ? <Loader className="animate-spin mx-auto" /> : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
