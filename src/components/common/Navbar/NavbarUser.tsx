"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useState, useEffect, useRef } from "react";
import islogo from "../../../../public/islogo.png";

export default function NavbarUser() {
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);

  // Added ref to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Added useEffect to close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Updated: close dropdown immediately before logout
  const handleLogout = async () => {
    setOpen(false); // <-- Close dropdown
    logout();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  // Updated: helper function to close dropdown when a link is clicked
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="bg-blue-900 text-white py-4 px-6 shadow-md flex justify-between items-center">
      {/* Logo */}
      <Link
        href="/"
        className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition"
      >
        <img
          src={islogo.src}
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full"
        />
        SafeTrip Explorer
      </Link>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Menu ▾
        </button>

        {open && (
          <div
            ref={dropdownRef} // <-- Added ref here
            className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50"
          >
            {/* Updated: Added onClick to close dropdown */}
            <Link
              href="/"
              onClick={handleLinkClick}
              className="block px-4 py-2 hover:bg-gray-100 transition"
            >
              Home
            </Link>

            <Link
              href="/features/dashboard/user"
              onClick={handleLinkClick}
              className="block px-4 py-2 hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/features/profile/user"
              onClick={handleLinkClick}
              className="block px-4 py-2 hover:bg-gray-100 transition"
            >
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
