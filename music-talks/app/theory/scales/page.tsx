"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TheoryNavbar from "../../components/theory/theoryNavbar";
import Scales from "../../components/theory/scales";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export default function TheoryScales() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const isAuthenticated = user !== null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth Notice Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                  <span className="text-2xl">🎵</span>
                  Want to fully experience music theory learning?
                </h3>
                <p className="text-sm text-amber-800 mt-1">
                  Sign in to save your learning progress, participate in discussions, and enjoy more features!
                </p>
              </div>
              <Link
                href="/account"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-[20rem_1fr] min-h-[calc(100vh-4rem)]">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col h-screen overflow-hidden">
          {/* Navigation Section */}
          <div className="flex-shrink-0">
            <TheoryNavbar />
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700 mt-auto">
            <p className="text-xs text-gray-500 text-center">
              Learn music theory with AI
            </p>
          </div>
        </div>
        <div className="theory-content overflow-y-auto">
          <Scales />
        </div>
      </div>
    </div>
  );
}
