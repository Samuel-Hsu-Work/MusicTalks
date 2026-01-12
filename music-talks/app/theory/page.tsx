"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import TheoryNavbar from "../components/theory/theoryNavbar";
import Notations from "../components/theory/notations";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

const MusicNotationCards = [
  {
    name: "Treble Clef",
    description:
      "The treble clef, or G clef, indicates higher-pitched notes and is commonly used for instruments like the violin and flute.",
  },
  {
    name: "Bass Clef",
    description:
      "The bass clef, or F clef, indicates lower-pitched notes and is commonly used for instruments like the cello and tuba.",
  },
  {
    name: "Whole Note",
    description:
      "A whole note lasts for four beats in 4/4 time and is represented as an open notehead without a stem.",
  },
  {
    name: "Half Note",
    description:
      "A half note lasts for two beats in 4/4 time and is represented as an open notehead with a stem.",
  },
  {
    name: "Quarter Note",
    description:
      "A quarter note lasts for one beat in 4/4 time and is represented as a filled notehead with a stem.",
  },
  {
    name: "Eighth Note",
    description:
      "An eighth note lasts for half a beat in 4/4 time and is represented with a flag on its stem.",
  },
  {
    name: "Sixteenth Note",
    description:
      "A sixteenth note lasts for a quarter of a beat in 4/4 time and has two flags on its stem.",
  },
  {
    name: "Beamed Eighth Note",
    description:
      "Two or more eighth notes can be connected with a beam to simplify notation.",
  },
  {
    name: "Whole Rest",
    description:
      "A whole rest indicates four beats of silence in 4/4 time and is represented by a box hanging from a line.",
  },
  {
    name: "Half Rest",
    description:
      "A half rest indicates two beats of silence in 4/4 time and is represented by a box sitting on a line.",
  },
  {
    name: "Quarter Rest",
    description:
      "A quarter rest indicates one beat of silence in 4/4 time and is shaped like a squiggly line.",
  },
  {
    name: "Eighth Rest",
    description:
      "An eighth rest indicates half a beat of silence in 4/4 time and is represented by a single flag symbol.",
  },
  {
    name: "Sixteenth Rest",
    description:
      "A sixteenth rest indicates a quarter of a beat of silence in 4/4 time and has two flags.",
  },
  {
    name: "Sharp",
    description:
      'A sharp raises the pitch of a note by a semitone, indicated by the "#" symbol.',
  },
  {
    name: "Flat",
    description:
      "A flat lowers the pitch of a note by a semitone, indicated by the ♭ symbol.",
  },
  {
    name: "Natural",
    description:
      "A natural cancels a sharp or flat, returning the note to its original pitch.",
  },
];

export default function Theory() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNotation, setSelectedNotation] = useState<{
    name: string;
    description: string;
  } | null>(null);

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
        {/* Left Sidebar with Navigation and Cards */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col h-screen overflow-hidden">
          {/* Navigation Section */}
          <div className="flex-shrink-0">
            <TheoryNavbar />
          </div>
          
          {/* Notation Cards Section */}
          <div className="flex-1 overflow-y-auto border-t border-gray-700">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Select a Notation
              </h3>
              <div className="space-y-2">
                {MusicNotationCards.map((notation, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedNotation(notation)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedNotation?.name === notation.name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="font-semibold text-sm mb-1">{notation.name}</div>
                    <div className="text-xs text-gray-400 line-clamp-2">
                      {notation.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              Learn music theory with AI
            </p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="theory-content overflow-y-auto">
          <Notations selectedNotation={selectedNotation} />
        </div>
      </div>
    </div>
  );
}
