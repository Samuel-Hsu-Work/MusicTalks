"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

interface Topic {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: string;
  topicId: string;
  username: string;
  text: string;
  createdAt: string;
}

export default function Forum() {
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [latestTopic, setLatestTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetchTopics();
    fetchLatestTopic();
  }, []);

  useEffect(() => {
    if (selectedTopicId) {
      fetchComments(selectedTopicId);
    } else if (latestTopic) {
      fetchComments(latestTopic.id);
    }
  }, [selectedTopicId, latestTopic]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/forum/topics`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch topics:", response.status, errorData);
        setTopics([]); // Set empty array instead of throwing
        return;
      }
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error: any) {
      console.error("Error fetching topics:", error);
      // Network error - backend might not be running
      setTopics([]);
      if (error.message?.includes('fetch')) {
        console.warn("Backend server may not be running or CORS issue");
      }
    }
  };

  const fetchLatestTopic = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/forum/topic/latest`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch latest topic:", response.status, errorData);
        setLatestTopic(null); // Set null instead of throwing
        setLoading(false);
        return;
      }
      const data = await response.json();
      setLatestTopic(data.topic || null);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching latest topic:", error);
      setLatestTopic(null);
      setLoading(false);
      if (error.message?.includes('fetch')) {
        console.warn("Backend server may not be running or CORS issue");
      }
    }
  };

  const fetchComments = async (topicId: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/forum/comments?topicId=${topicId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || !user) return;

    setSubmitting(true);
    setError(null);

    try {
      const topicId = displayedTopic?.id;
      if (!topicId) {
        setError("No topic selected");
        setSubmitting(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/forum/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId,
          username: user.username,
          text: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to post comment");
      }

      setNewComment("");
      await fetchComments(topicId);
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      setError(error.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const isAuthenticated = user !== null;

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which topic to display in the main content area
  const displayedTopic = selectedTopicId
    ? topics.find((topic) => topic.id === selectedTopicId) || null
    : latestTopic;

  // Check if the displayed topic is the latest topic
  const isLatestTopic = displayedTopic?.id === latestTopic?.id;

  const formatCommentTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return `Today ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 min-h-screen bg-white shadow-sm border-r border-gray-200 p-6 overflow-y-auto">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search topics..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm text-gray-900 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Latest Topic */}
        {latestTopic && (
          <div className="mb-4 pb-4 border-b-2 border-gray-200">
            <div
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 ${
                selectedTopicId === null
                  ? "bg-green-50 border-green-500"
                  : "border-transparent hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTopicId(null)}
            >
              <div className="w-3 h-3 rounded-full bg-green-500 mr-3 flex-shrink-0"></div>
              <h3 className="text-sm font-semibold text-gray-900">Latest Topic</h3>
            </div>
          </div>
        )}

        {/* All Topics */}
        {filteredTopics.length > 0 && (
          <>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
              All Topics
            </h3>
            <div className="flex flex-col gap-2">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedTopicId === topic.id
                      ? "bg-blue-50 border-blue-500"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                  <span
                    className={`text-sm ${
                      selectedTopicId === topic.id
                        ? "font-semibold text-blue-900"
                        : "text-gray-900"
                    }`}
                  >
                    {topic.title}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredTopics.length === 0 && !latestTopic && (
          <div className="text-sm text-gray-500 py-4 text-center">
            No topics available
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Discussion Topic Card */}
          {displayedTopic ? (
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Discussion Topic</h2>
                <span className="text-sm text-gray-500">
                  {new Date(displayedTopic.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
                {displayedTopic.title}
                {isLatestTopic && (
                  <span className="text-xs font-medium text-white bg-green-500 px-3 py-1 rounded-full uppercase tracking-wide">
                    Latest
                  </span>
                )}
              </h3>

              <div className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                {displayedTopic.content}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-1.008c-.75.516-1.5.923-2.5 1.01A5.99 5.99 0 010 11.52v-.03c.01-.82.435-1.5.987-1.979.43-.44.854-.88 1.264-1.332A6.563 6.563 0 012 7c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{comments.length} comments</span>
                </div>
                <a
                  href="#comment-section"
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                >
                  Join Discussion →
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
              <p className="text-gray-500">No topics available.</p>
            </div>
          )}

          {/* Comments Section */}
          <div id="comment-section" className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
            </div>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-3">
                  <span className="text-sm text-gray-500">
                    Currently logged in as:{" "}
                    <span className="font-semibold text-gray-900">{user?.username}</span>
                  </span>
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 resize-y min-h-[100px] transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 mb-4"
                  placeholder="Share your thoughts on this music theory topic..."
                  rows={4}
                  disabled={!displayedTopic}
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!newComment.trim() || submitting || !displayedTopic}
                >
                  {submitting ? "Posting..." : "Post Comment"}
                </button>
              </form>
            ) : (
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-8 text-center">
                <p className="text-yellow-800 mb-4">
                  You must be logged in to post comments.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/account"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {comment.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{comment.username}</h4>
                          <span className="text-xs text-gray-500">
                            {formatCommentTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
