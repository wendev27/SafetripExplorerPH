"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Spot {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  images: string[];
  amenities: string[];
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/admin/spots/my-spots")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Admin spots:", data);
          if (data.success) {
            setSpots(data.data || []);
          } else {
            console.error("API returned success=false:", data);
            setSpots([]);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setSpots([]);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleDeleteSpot = async (spotId: string) => {
    if (!confirm("Are you sure you want to delete this spot?")) return;

    try {
      const response = await fetch(`/api/admin/spots/${spotId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Spot deleted successfully!");
        setSpots(spots.filter(spot => spot._id !== spotId));
      } else {
        alert("Failed to delete spot");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting spot");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard - {session?.user?.name} 👋</h1>

      <p className="mt-4 text-gray-600">
        Manage tourist spots and oversee the platform.
      </p>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Add New Spot</h3>
          <p className="text-blue-600 mb-4">Create a new tourist spot for users to discover.</p>
          <a
            href="/features/spots/admin"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Spot
          </a>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-2">View All Spots</h3>
          <p className="text-green-600 mb-4">Browse and manage all spots in the system.</p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            View Spots
          </a>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">User Management</h3>
          <p className="text-purple-600 mb-4">Manage user accounts and permissions.</p>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            onClick={() => alert("Feature coming soon!")}
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* My Created Spots Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">My Created Spots ({spots.length})</h2>

        {loading ? (
          <p className="text-gray-600">Loading your spots...</p>
        ) : spots.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">You haven't created any spots yet.</p>
            <a
              href="/features/spots/admin"
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Create Your First Spot
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <div
                key={spot._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border"
              >
                {/* Spot Image */}
                <img
                  src={spot.images?.[0] || "/placeholder-image.jpg"}
                  alt={spot.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  {/* Title & Category */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{spot.title}</h3>
                    <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                      {spot.category}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-gray-500 text-sm mb-2">{spot.location}</p>

                  {/* Description preview */}
                  <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                    {spot.description}
                  </p>

                  {/* Price */}
                  <p className="text-lg font-bold text-green-600 mb-3">
                    ₱{spot.price.toLocaleString()}
                  </p>

                  {/* Created Date */}
                  <p className="text-gray-500 text-xs mb-4">
                    Created: {new Date(spot.createdAt).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/features/spots/user/check-spot/${spot._id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteSpot(spot._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Links */}
      <div className="mt-12 pt-8 border-t">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-x-4">
          <a
            href="/profile"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Profile
          </a>

          <a
            href="/profile/change-password"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Change Password
          </a>
        </div>
      </div>
    </div>
  );
}
