// src/components/common/Navbar/NavbarAnonymous.tsx
import Link from "next/link";

export default function NavbarAnonymous() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">
        SafeTrip Explorer
      </Link>
      <div className="space-x-4">
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
        <Link href="/spots">Explore</Link>
      </div>
    </nav>
  );
}
