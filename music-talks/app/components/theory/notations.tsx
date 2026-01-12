"use client";

import { useState, useEffect } from "react";

interface Message {
  content: string;
  isUser: boolean;
}

interface NotationsProps {
  selectedNotation: { name: string; description: string } | null;
}

export default function Notations({ selectedNotation }: NotationsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userBackground, setUserBackground] = useState("");
  const [explanationMode, setExplanationMode] = useState<"music" | "career">(
    "music"
  );
  const [loading, setLoading] = useState(false);

  // Handle notation selection from parent
  useEffect(() => {
    if (selectedNotation) {
      handleNotationSelection(selectedNotation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNotation]);

  const handleNotationSelection = async (notation: {
    name: string;
    description: string;
  }) => {
    if (!notation || loading) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { content: `What is ${notation.name}?`, isUser: true },
    ]);

    setLoading(true);

    // Call backend AI API endpoint
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    try {
      const response = await fetch(`${backendUrl}/api/ai/explain-notation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notation: notation.name,
          mode: explanationMode,
          background: explanationMode === "career" ? userBackground : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get AI explanation");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { content: data.explanation, isUser: false }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          content: error.message || "Error fetching response. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Music Notations
          </h1>
          <p className="text-gray-600">
            Select a notation from the sidebar to learn more with AI-powered explanations
          </p>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Career Background Input */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="background"
              >
                Career Background (Optional)
              </label>
              <input
                type="text"
                id="background"
                value={userBackground}
                onChange={(e) => setUserBackground(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all"
                placeholder="e.g., software engineer, teacher, doctor..."
                disabled={explanationMode === "music"}
              />
            </div>

            {/* Explanation Mode Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Explanation Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setExplanationMode("music")}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    explanationMode === "music"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Music Theory
                </button>
                <button
                  onClick={() => setExplanationMode("career")}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    explanationMode === "career"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Career Analogy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat/Messages Section - Now takes full width */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 className="text-xl font-bold text-white">AI Explanation</h2>
          </div>
          <div className="p-6 h-[calc(100vh-22rem)] overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-gray-500 text-lg font-medium">
                  Select a notation from the sidebar
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  to get an AI-powered explanation
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-gray-900 border-2 border-gray-200 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border-2 border-gray-200 rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
