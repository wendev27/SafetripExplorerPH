"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useState } from "react";
import islogo from "../../../../public/islogo.png";

export default function NavbarUser() {
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white py-6 px-30 flex justify-between items-center">
      {/* Logo + Title */}
      <Link href="/" className="font-bold text-xl flex items-center gap-2">
        <img
          src={islogo.src}
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full"
        />
        SafeTrip Explorer
      </Link>

      {/* Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 duration-200"
        >
          Menu ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
            <Link href="/" className="block px-4 py-2 hover:bg-gray-200">
              Home
            </Link>

            <Link
              href="/features/dashboard/user"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Dashboard
            </Link>

            <Link
              href="/features/profile/user"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              My Profile
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
