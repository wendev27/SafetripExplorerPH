"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="py-50 flex justify-center items-center bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Your Profile
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700 font-medium">
              <strong>Name:</strong> {session?.user?.name}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700 font-medium">
              <strong>Email:</strong> {session?.user?.email}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-700 font-medium">
              <strong>Role:</strong> {session?.user?.userRole}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/features/profile/user/update"
            className="block text-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
