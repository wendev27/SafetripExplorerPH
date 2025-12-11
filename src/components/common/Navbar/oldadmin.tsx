"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useState } from "react";
import islogo from "../../../../public/islogo.png";

export default function NavbarAdmin() {
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-700 text-white py-6 px-30 flex justify-between items-center">
      {/* Logo + Title */}
      <Link
        href="/features/dashboard/admin"
        className="font-bold text-xl flex items-center gap-2"
      >
        <img
          src={islogo.src}
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full"
        />
        SafeTrip Admin
      </Link>

      {/* DROPDOWN */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-800 px-4 py-2 rounded-lg hover:bg-blue-900 duration-200"
        >
          Menu ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
            <Link
              href="/features/dashboard/admin"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Dashboard
            </Link>

            <Link
              href="/features/spots/admin/"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Add Spots
            </Link>

            {/* <Link
              href="/features/reviews/admin"
              className="block px-4 py-2 hover:bg-gray-200"
            >
              Manage Reviews
            </Link> */}

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
