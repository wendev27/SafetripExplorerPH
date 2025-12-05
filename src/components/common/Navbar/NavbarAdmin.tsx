// src/components/common/Navbar/NavbarAdmin.tsx
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function NavbarAdmin() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logout(); // reset Zustand user
    await signOut({ redirect: false }); // log out from NextAuth
    // optional: redirect manually after logout
    window.location.href = "/";
  };
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/features/dashboard/admin" className="font-bold text-xl">
        SafeTrip Admin
      </Link>
      <div className="space-x-4">
        <Link href="/logout"></Link>
      </div>
      <div className="space-x-4">
        <Link href="/features/dashboard/admin">Dashboard</Link>
        <Link href="/features/spots/admin/">Manage Spots</Link>
        <Link href="/features">Manage Reviews</Link>

        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-gray-200 ml-7"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
