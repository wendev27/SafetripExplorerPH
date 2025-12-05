// src/components/common/Navbar/NavbarAnonymous.tsx
import Link from "next/link";
import islogo from "../../../../public/islogo.png";

export default function NavbarAnonymous() {
  return (
    <nav className="bg-blue-600 text-white py-6 px-30 flex justify-between items-center">
      <Link
        href="/"
        className="font-bold text-xl justify-center flex items-center gap-2"
      >
        <img
          src={islogo.src} // Path to your JPEG image
          alt="SafeTrip Icon"
          className="h-8 w-8 object-cover rounded-full" // Adjust size as needed
        />
        SafeTrip Explorer
      </Link>
      <div className="space-x-4">
        <Link href="/auth/login/">Explore</Link>
      </div>
    </nav>
  );
}
