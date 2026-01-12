"use client";

import { useState } from "react";

interface GridCellProps {
  content: string;
  isFrequency?: boolean;
}

const GridCell = ({ content, isFrequency = false }: GridCellProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 ${
        isFrequency
          ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white px-4 py-3 text-sm min-w-[120px]"
          : "bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 text-xl"
      }`}
    >
      {content}
    </div>
  );
};

interface GridProps {
  data: string[];
  title: string;
  isFrequency?: boolean;
}

const Grid = ({ data, title, isFrequency = false }: GridProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {data.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-gray-400 italic">
              Select a scale to view {title.toLowerCase()}
            </p>
          </div>
        ) : (
          data.map((item, index) => (
            <GridCell key={index} content={item} isFrequency={isFrequency} />
          ))
        )}
      </div>
    </div>
  );
};

export default function Scales() {
  const [notesSet, setNotesSet] = useState<string[]>([]);
  const [frequencies, setFrequencies] = useState<number[]>([]);
  const [selectedScale, setSelectedScale] = useState<string>("");

  const noteSets = {
    set1: ["C", "D", "E", "F", "G", "A", "B"],
    set2: ["D", "E", "F#", "G", "A", "B", "C#"],
  };

  const calculateFrequencies = (
    firstNoteFrequency: number,
    selectedIndices: number[]
  ) => {
    const allFrequencies = [
      "C",
      "C# / Db",
      "D",
      "D# / Eb",
      "E",
      "F",
      "F# / Gb",
      "G",
      "G# / Ab",
      "A",
      "A# / Bb",
      "B",
    ].map((note, index) => {
      const halfSteps = index;
      return firstNoteFrequency * Math.pow(2, halfSteps / 12);
    });

    const selectedFrequencies = selectedIndices.map(
      (index) => allFrequencies[index]
    );
    return selectedFrequencies;
  };

  const handleNotesSet1 = () => {
    setNotesSet(noteSets.set1);
    setFrequencies(calculateFrequencies(261.63, [0, 2, 4, 5, 7, 9, 11]));
    setSelectedScale("C Major");
  };

  const handleNotesSet2 = () => {
    setNotesSet(noteSets.set2);
    setFrequencies(calculateFrequencies(293.66, [0, 2, 4, 5, 7, 9, 11]));
    setSelectedScale("D Major");
  };

  const scales = [
    { name: "C Major", handler: handleNotesSet1, key: "c-major" },
    { name: "D Major", handler: handleNotesSet2, key: "d-major" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Musical Scales
          </h1>
          <p className="text-gray-600">
            Explore different musical scales and their frequencies
          </p>
        </div>

        {/* Scale Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Select a Scale
          </label>
          <div className="flex flex-wrap gap-4">
            {scales.map((scale) => (
              <button
                key={scale.key}
                onClick={scale.handler}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md ${
                  selectedScale === scale.name
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white scale-105 shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300 hover:border-blue-400"
                }`}
              >
                {scale.name} Scale
              </button>
            ))}
          </div>
        </div>

        {/* Scales Display Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Grid data={notesSet} title="Musical Notes" />
          <Grid
            data={frequencies.map((freq) => freq.toFixed(2) + " Hz")}
            title="Note Frequencies"
            isFrequency={true}
          />
        </div>

        {/* Info Section */}
        {selectedScale && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="text-4xl mr-3">🎼</div>
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedScale} Scale
              </h3>
            </div>
            <p className="text-gray-700 text-center leading-relaxed">
              The <strong>{selectedScale}</strong> scale consists of{" "}
              <strong>{notesSet.length} notes</strong>. Each note has a specific
              frequency measured in Hertz (Hz), which determines its pitch. The
              frequency increases exponentially as you move up the scale, with
              each octave doubling the frequency.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!selectedScale && (
          <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No scale selected
            </p>
            <p className="text-gray-400 text-sm">
              Choose a scale above to view its notes and frequencies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
