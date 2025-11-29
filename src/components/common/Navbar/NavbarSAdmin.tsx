// src/components/common/Navbar/NavbarAdmin.tsx
import Link from "next/link";

export default function NavbarSuperAdmin() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        SafeTrip Explorer
      </Link>
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/spots">Manage Spots</Link>
        <Link href="/reviews">Reviews</Link>
        <Link href="/users">Users</Link>
        <Link href="/logout">Logout</Link>
      </div>
    </nav>
  );
}
