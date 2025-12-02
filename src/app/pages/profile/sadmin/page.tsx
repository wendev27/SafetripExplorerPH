"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="p-10 max-w-xl mx-10 bg-gray-100 rounded shadow text-c">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2">
          <strong>Name:</strong> {session?.user?.name}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {session?.user?.email}
        </p>

        <Link
          href="/pages/profile/user/update"
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </Link>
      </div>
    </div>
  );
}
