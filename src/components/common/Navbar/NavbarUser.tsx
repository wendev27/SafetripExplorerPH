// src/components/common/Navbar/NavbarUser.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function NavbarUser() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logout(); // reset Zustand user
    await signOut({ redirect: false }); // log out from NextAuth
    // optional: redirect manually after logout
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        SafeTrip Explorer
      </Link>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/features/dashboard/user">Dashboard</Link>
        <Link href="/features/profile/user">My Profile</Link>
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
