'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages');
      const data = await res.json();

      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0].user);
        }
      }
    } catch (error) {
      toast.error('Failed to load conversations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await fetch(`/api/messages?conversationWith=${userId}`);
      const data = await res.json();

      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error('Failed to load messages');
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSending(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedConversation._id,
          content: messageText
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setMessageText('');
        toast.success('Message sent!');
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        toast.success('Message deleted');
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg">Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="flex h-screen">
        {/* Conversations List */}
        <div className="w-80 border-r border-zinc-700 bg-zinc-800 overflow-y-auto">
          <div className="p-4 border-b border-zinc-700">
            <h2 className="text-xl font-bold text-white">Messages</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="animate-spin text-white" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-zinc-400">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2 p-2">
              {conversations.map(conv => (
                <button
                  key={conv.user._id}
                  onClick={() => setSelectedConversation(conv.user)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedConversation?._id === conv.user._id
                      ? 'bg-blue-600'
                      : 'hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={conv.user.profilePic || '/default-avatar.png'}
                      alt={conv.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{conv.user.name}</p>
                      <p className="text-sm text-zinc-400 truncate">
                        {conv.lastMessage.content.substring(0, 30)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-zinc-900">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-zinc-700 flex items-center gap-3">
                <img
                  src={selectedConversation.profilePic || '/default-avatar.png'}
                  alt={selectedConversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-white">{selectedConversation.name}</p>
                  <p className="text-sm text-zinc-400">@{selectedConversation.username}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-zinc-400">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender._id === session.user.email ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg group relative ${
                          msg.sender._id === session.user.email
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-700 text-white'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                        {msg.sender._id === session.user.email && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 size={16} className="text-red-500 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-700 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {sending ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
