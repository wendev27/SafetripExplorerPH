// src/components/common/Footer/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-8 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Branding */}
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">SafeTrip Explorer</h1>
          <p className="text-sm text-gray-200">
            Explore the Philippines safely
          </p>
        </div>

        {/* Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/spots" className="hover:text-gray-300">
            Tourist Spots
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <svg
              className="w-6 h-6 fill-current hover:text-gray-300"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.56c-.89.39-1.85.65-2.85.77a5 5 0 0 0 2.18-2.76 9.94 9.94 0 0 1-3.16 1.21 5.03 5.03 0 0 0-8.57 4.59A14.28 14.28 0 0 1 1.67 3.16 5 5 0 0 0 3.18 9.7 4.94 4.94 0 0 1 .96 9.1v.06a5 5 0 0 0 4 4.9 5 5 0 0 1-2.26.09 5.04 5.04 0 0 0 4.7 3.5A10.08 10.08 0 0 1 0 19.54a14.2 14.2 0 0 0 7.69 2.25c9.22 0 14.26-7.64 14.26-14.26v-.65A10.16 10.16 0 0 0 24 4.56z" />
            </svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <svg
              className="w-6 h-6 fill-current hover:text-gray-300"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.61.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.88 1.51 2.31 1.08 2.87.82.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.53 9.53 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.41-.01 2.74 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.06c0-5.54-4.5-10.02-10-10.02z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="text-center text-gray-300 text-sm mt-6">
        &copy; {new Date().getFullYear()} SafeTrip Explorer. All rights
        reserved.
      </div>
    </footer>
  );
}
