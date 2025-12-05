"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  spotId: {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    price: number;
    images: string[];
  };
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/me")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("User applications:", data);
          if (data.success) {
            setApplications(data.data || []);
          } else {
            console.error("API returned success=false:", data);
            setApplications([]);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setApplications([]);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name} 👋</h1>

      <p className="mt-4 text-gray-600">
        Manage your spot applications and bookings.
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

      {/* Booked Spots Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">My Applications</h2>

        {loading ? (
          <p className="text-gray-600">Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">You haven't applied for any spots yet.</p>
            <a
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Browse Available Spots
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border"
              >
                {/* Spot Image */}
                <img
                  src={application.spotId.images?.[0] || "/placeholder-image.jpg"}
                  alt={application.spotId.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{application.spotId.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-gray-500 text-sm mb-2">{application.spotId.location}</p>

                  {/* Category */}
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mb-3 inline-block">
                    {application.spotId.category}
                  </span>

                  {/* Price */}
                  <p className="text-lg font-bold text-green-600 mb-3">
                    ₱{application.spotId.price.toLocaleString()}
                  </p>

                  {/* Applied Date */}
                  <p className="text-gray-500 text-xs">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </p>

                  {/* View Details Button */}
                  <a
                    href={`/features/spots/user/check-spot/${application.spotId._id}`}
                    className="mt-3 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition block text-center"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
