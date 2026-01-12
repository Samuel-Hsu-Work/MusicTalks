"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TheoryNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/theory", label: "Notations", icon: "🎵" },
    { href: "/theory/scales", label: "Scales", icon: "🎼" },
  ];

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Music Theory</h2>
        <p className="text-sm text-gray-400 mt-1">Learning Center</p>
      </div>

      {/* Navigation Items */}
      <ul className="pt-4 px-4 border-b border-gray-700 pb-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="mb-2">
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
