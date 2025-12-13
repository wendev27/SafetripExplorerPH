// src/components/common/Navbar/NavbarAnonymous.tsx
import Link from "next/link";
import islogo from "../../../../public/islogo.png";

export default function NavbarAnonymous() {
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

      {/* Links */}
      <div className="space-x-4 flex items-center">
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Explore
        </Link>

        <Link
          href="/auth/register"
          className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
