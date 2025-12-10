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
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

interface Loyalty {
  userId: string;
  points: Number;
}

interface Booking {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  paymentMethod: "gcash" | "credit_card" | "cash";
  paymentDetails?: {
    gcashNumber?: string;
    cardNumber?: string;
    cardholderName?: string;
  };
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

  // ⭐ ADDED: sorting state
  const [bookingSort, setBookingSort] = useState("newest");

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

  const handleToggleSpotStatus = async (
    spotId: string,
    isCurrentlyActive: boolean
  ) => {
    const targetSpot = spots.find((s) => s._id === spotId);
    if (targetSpot && targetSpot.status !== "approved") {
      alert(
        "You can only enable/disable spots that are approved by the super admin."
      );
      return;
    }
    const action = isCurrentlyActive ? "disable" : "enable";
    if (
      !confirm(
        `Are you sure you want to ${action} this spot? ${
          isCurrentlyActive
            ? "It will no longer be visible to users."
            : "It will become visible to users again."
        }`
      )
    )
      return;

    try {
      const response = await fetch(`/api/admin/spots/${spotId}`, {
        method: "DELETE", // Using DELETE method but for toggling status
      });

      if (response.ok) {
        alert(`Spot ${action}d successfully!`);
        // Update the spot's isActive status in the local state
        setSpots(
          spots.map((spot) =>
            spot._id === spotId
              ? { ...spot, isActive: !isCurrentlyActive }
              : spot
          )
        );
      } else {
        alert(`Failed to ${action} spot`);
      }
    } catch (error) {
      console.error("Toggle error:", error);
      alert(`Error ${action === "disable" ? "disabling" : "enabling"} spot`);
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
        fetchBookings();
      } else {
        alert("Failed to update booking status");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Error updating booking");
    }
  };

  const addPointsForCompletedBooking = async (
    userId: string,
    points: number
  ) => {
    try {
      const response = await fetch("/api/admin/loyalty/${userId}", {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error adding points for complete booking", error);
      alert("Error for loyalty points");
    }
  };

  const tabs = [
    { id: "spots" as TabType, label: "My Spots", icon: "🏖️" },
    { id: "bookings" as TabType, label: "Booking Requests", icon: "📅" },
  ];

  // ⭐ ADDED: sorting logic
  const sortedBookings = [...bookings].sort((a, b) => {
    if (bookingSort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (bookingSort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (bookingSort === "status") {
      const order = ["pending", "accepted", "rejected", "completed"];
      return order.indexOf(a.status) - order.indexOf(b.status);
    }
    return 0;
  });

  return (
    <div className="p-10">
      <div className="max-w-7xl mx-auto ">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Admin Dashboard - {session?.user?.name}
            </h1>

            <p className="mt-4 text-gray-600">
              Manage your tourist spots and handle booking requests.
            </p>
          </div>
        </div>

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
          {/* SPOTS TAB */}
          {activeTab === "spots" && (
            <div>
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    Add New Spot
                  </h3>
                  <p className="text-blue-600 mb-4">
                    Create a new tourist spot for users to discover.
                  </p>
                  <a
                    href="/features/spots/admin"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Add Spot
                  </a>
                </div>

                {/* Commented code preserved */}
                {/* <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  ...
                </div> */}
              </div>

              {/* My Created Spots */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-6">
                  My Created Spots ({spots.length})
                </h2>

                {loading ? (
                  <p className="text-gray-600">Loading your spots...</p>
                ) : spots.length === 0 ? (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">
                      You haven't created any spots yet.
                    </p>
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
                        className={`bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border ${
                          !spot.isActive ? "opacity-60 border-red-200" : ""
                        }`}
                      >
                        <img
                          src={spot.images?.[0] || "/placeholder-image.jpg"}
                          alt={spot.title}
                          className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3
                              className={`text-xl font-semibold ${
                                !spot.isActive ? "text-gray-500" : ""
                              }`}
                            >
                              {spot.title}
                            </h3>
                            <div className="flex gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  spot.status === "approved"
                                    ? "bg-green-100 text-green-600"
                                    : spot.status === "rejected"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {spot.status}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  spot.isActive
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {spot.isActive ? "Active" : "Disabled"}
                              </span>
                              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                                {spot.category}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-500 text-sm mb-2">
                            {spot.location}
                          </p>

                          <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                            {spot.description}
                          </p>

                          <p className="text-lg font-bold text-green-600 mb-3">
                            ₱{spot.price.toLocaleString()}
                          </p>

                          <p className="text-gray-500 text-xs mb-4">
                            Created:{" "}
                            {new Date(spot.createdAt).toLocaleDateString()}
                          </p>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/features/spots/user/check-spot/${spot._id}`
                                )
                              }
                              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() =>
                                router.push(
                                  `/features/spots/admin/edit/${spot._id}`
                                )
                              }
                              disabled={spot.status !== "approved"}
                              className={`px-3 py-2 rounded transition text-sm text-white ${
                                spot.status === "approved"
                                  ? "bg-yellow-600 hover:bg-yellow-700"
                                  : "bg-gray-300 cursor-not-allowed"
                              }`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleToggleSpotStatus(spot._id, spot.isActive)
                              }
                              disabled={spot.status !== "approved"}
                              className={`px-3 py-2 text-white rounded hover:opacity-80 transition text-sm ${
                                spot.status !== "approved"
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : spot.isActive
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {spot.isActive ? "Disable" : "Enable"}
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

          {/* BOOKINGS TAB */}
          {activeTab === "bookings" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Booking Requests
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage bookings for your tourist spots
                  </p>
                </div>

                {/* ⭐ ADDED: Sorting dropdown */}
                <select
                  className="border px-3 py-2 rounded text-sm"
                  value={bookingSort}
                  onChange={(e) => setBookingSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-6 text-center">Loading bookings...</div>
                ) : sortedBookings.length === 0 ? (
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
                          Payment Method
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
                      {sortedBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userId?.email}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.spotId?.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.spotId?.location}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.paymentMethod === "gcash"
                                  ? "bg-blue-100 text-blue-800"
                                  : booking.paymentMethod === "credit_card"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.paymentMethod === "gcash"
                                ? "📱 GCash"
                                : booking.paymentMethod === "credit_card"
                                ? "💳 Card"
                                : "💵 Cash"}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateBookingStatus(booking._id, "accepted")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    updateBookingStatus(booking._id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {booking.status === "accepted" && (
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking._id, "completed")
                                }
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
    </div>
  );
}
