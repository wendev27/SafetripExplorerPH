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

interface Booking {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  spotId: {
    _id: string;
    title: string;
    location: string;
    price: number;
  };
  createdAt: string;
}

type TabType = "spots" | "bookings";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("spots");
  const [spots, setSpots] = useState<Spot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      if (activeTab === "spots") {
        fetchSpots();
      } else if (activeTab === "bookings") {
        fetchBookings();
      }
    }
  }, [session, activeTab]);

  const fetchSpots = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/spots/my-spots");
      const data = await response.json();
      if (data.success) {
        setSpots(data.data);
      }
    } catch (error) {
      console.error("Error fetching spots:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert(`Booking ${newStatus} successfully!`);
        fetchBookings(); // Refresh the list
      } else {
        alert("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking");
    }
  };

  const tabs = [
    { id: "spots" as TabType, label: "My Spots", icon: "🏖️" },
    { id: "bookings" as TabType, label: "Booking Requests", icon: "📅" },
  ];

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard - {session?.user?.name} 👋</h1>

      <p className="mt-4 text-gray-600">
        Manage your tourist spots and handle booking requests.
      </p>

      {/* Navigation Tabs */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "spots" && (
          <div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Booking Requests</h2>
              <p className="text-sm text-gray-500">Manage bookings for your tourist spots</p>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">Loading bookings...</div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No booking requests at the moment.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.userId?.name}</div>
                          <div className="text-sm text-gray-500">{booking.userId?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.spotId?.title}</div>
                          <div className="text-sm text-gray-500">{booking.spotId?.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === "accepted" ? "bg-green-100 text-green-800" :
                            booking.status === "rejected" ? "bg-red-100 text-red-800" :
                            booking.status === "completed" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking._id, "accepted")}
                                className="text-green-600 hover:text-green-900"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking._id, "rejected")}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === "accepted" && (
                            <button
                              onClick={() => updateBookingStatus(booking._id, "completed")}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
