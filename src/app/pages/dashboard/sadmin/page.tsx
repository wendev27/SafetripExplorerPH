"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name} 👋</h1>

      <p className="mt-4 text-gray-600">
        This is your dashboard. More features coming soon!
      </p>

      <div className="mt-6 space-x-4">
        <a
          href="/profile"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Profile
        </a>

        <a
          href="/profile/change-password"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Change Password
        </a>
      </div>
    </div>
  );
}
