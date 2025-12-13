"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useState, useRef, useEffect } from "react";
import islogo from "../../../../public/islogo.png";

export default function NavbarAdmin() {
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔧 ADDED: close dropdown on navigation
  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  // Close dropdown when clicking outside
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

  return (
    <nav className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* Logo + Title */}
      <Link
        href="/features/dashboard/admin"
        className="font-bold text-xl flex items-center gap-2 hover:opacity-90 transition"
      >
        <img
          src={islogo.src}
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full"
        />
        SafeTrip Admin
      </Link>

      {/* DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-900 transition duration-200"
        >
          Menu
          <span
            className={`transform transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50 animate-fadeIn">
            <Link
              href="/features/dashboard/admin"
              className="block px-4 py-2 hover:bg-gray-100 transition"
              onClick={closeMenu} // 🔧 ADDED
            >
              Dashboard
            </Link>

            <Link
              href="/features/spots/admin/"
              className="block px-4 py-2 hover:bg-gray-100 transition"
              onClick={closeMenu} // 🔧 ADDED
            >
              Add Spots
            </Link>

            {/* Optional: Manage Reviews */}
            {/* <Link
              href="/features/reviews/admin"
              className="block px-4 py-2 hover:bg-gray-100 transition"
            >
              Manage Reviews
            </Link> */}

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
