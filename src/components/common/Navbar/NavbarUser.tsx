// src/components/common/Navbar/NavbarUser.tsx
import Link from "next/link";

export default function NavbarUser() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        SafeTrip Explorer
      </Link>
      <div className="space-x-4">
        <Link href="/spots">Explore</Link>
        <Link href="/profile">My Profile</Link>
        <Link href="/logout">Logout</Link>
      </div>
    </nav>
  );
}
