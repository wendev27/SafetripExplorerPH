// src/components/common/Navbar/NavbarAdmin.tsx
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";
import islogo from "../../../../public/islogo.png";

export default function NavbarSuperAdmin() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    logout(); // reset Zustand user
    await signOut({ redirect: false }); // log out from NextAuth
    // optional: redirect manually after logout
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-700 text-white py-6 px-30 flex justify-between items-center">
      <Link
        href="/"
        className="font-bold text-xl justify-center flex items-center gap-2"
      >
        <img
          src={islogo.src} // Path to your JPEG image
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full " // Adjust size as needed
        />
        SafeTrup Super-Admin
      </Link>
      <div className="space-x-4">
        <Link href="/logout"></Link>
      </div>
      <div className="space-x-4">
        <Link href="/features/dashboard/sadmin">Dashboard</Link>
        {/* <Link href="/spots">Manage Spots</Link>
        <Link href="/reviews">Reviews</Link>
        <Link href="/users">Users</Link>
        <Link href="/logs">Logs</Link> */}
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
