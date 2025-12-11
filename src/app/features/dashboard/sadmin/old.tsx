"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  name: string;
  email: string;
  userRole: "user" | "admin" | "superadmin";
  createdAt: string;
}

interface Spot {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  images: string[];
  ownerId: {
    _id: string;
    name: string;
    email: string;
    userRole: string;
  };
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
    userRole: string;
  };
  reviewNotes?: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  userId: {
    _id: string;
    name: string;
    email: string;
    userRole: string;
  };
  spotId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    ownerId: string;
  };
  createdAt: string;
}

type TabType = "overview" | "users" | "spots" | "bookings";

export default function SuperAdminDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "users" && users.length === 0) {
      fetchUsers();
    } else if (activeTab === "spots" && spots.length === 0) {
      fetchSpots();
    } else if (activeTab === "bookings" && bookings.length === 0) {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sadmin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpots = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sadmin/spots");
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
      const response = await fetch("/api/sadmin/bookings");
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

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/sadmin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: newRole }),
      });

      if (response.ok) {
        alert("User role updated successfully!");
        fetchUsers(); // Refresh the list
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/sadmin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const approveSpot = async (spotId: string) => {
    const reviewNotes = prompt("Add review notes (optional):");
    if (reviewNotes === null) return; // User cancelled

    try {
      const response = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", reviewNotes }),
      });

      if (response.ok) {
        alert("Spot approved successfully!");
        fetchSpots(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Failed to approve spot: ${error.message}`);
      }
    } catch (error) {
      console.error("Error approving spot:", error);
      alert("Error approving spot");
    }
  };

  const rejectSpot = async (spotId: string) => {
    const reviewNotes = prompt("Please provide rejection reason:");
    if (!reviewNotes || reviewNotes.trim() === "") {
      alert("Rejection reason is required");
      return;
    }

    try {
      const response = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reviewNotes }),
      });

      if (response.ok) {
        alert("Spot rejected successfully!");
        fetchSpots(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Failed to reject spot: ${error.message}`);
      }
    } catch (error) {
      console.error("Error rejecting spot:", error);
      alert("Error rejecting spot");
    }
  };

  const deleteSpot = async (spotId: string) => {
    if (
      !confirm(
        "Are you sure you want to toggle this spot? It will switch between enabled and disabled."
      )
    )
      return;

    try {
      const response = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `Spot ${data.data?.isActive ? "enabled" : "disabled"} successfully!`
        );
        fetchSpots(); // Refresh the list to show updated status
      } else {
        alert("Failed to toggle spot");
      }
    } catch (error) {
      console.error("Error toggling spot:", error);
      alert("Error toggling spot");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "📊" },
    { id: "users" as TabType, label: "Manage Users", icon: "👥" },
    { id: "spots" as TabType, label: "Manage Spots", icon: "🏖️" },
    { id: "bookings" as TabType, label: "All Bookings", icon: "📅" },
    { id: "logs" as TabType, label: "System Logs", icon: "📝" },
  ];

  return (
    <div className="p-10 min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow mr-6">
        <nav className="flex flex-col py-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium text-left border-l-4 transition-all
            ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content (your existing tab content stays here) */}
      <div className="flex-1">
        {/* put the rest of your dashboard content here */}
      </div>

      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Super Admin Dashboard - {session?.user?.name}
            </h1>

            <p className="mt-4 text-gray-600">
              Manage your website's users, spots, and bookings efficiently.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.length || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏖️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Spots
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {spots.length || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {bookings.length || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">👑</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      System Status
                    </p>
                    <p className="text-lg font-bold text-green-600">Online</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  User Management
                </h2>
                <p className="text-sm text-gray-500">
                  Manage all users and their roles
                </p>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-6 text-center">Loading users...</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                user.userRole
                              )}`}
                            >
                              {user.userRole}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <select
                              value={user.userRole}
                              onChange={(e) =>
                                updateUserRole(user._id, e.target.value)
                              }
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "spots" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Spot Management
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage all tourist spots in the system
                  </p>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="text-center">Loading spots...</div>
                  ) : (
                    <div className="space-y-4">
                      {/* Pending Spots Section */}
                      {spots.filter(
                        (spot) => (spot.status || "pending") === "pending"
                      ).length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-700 mb-3">
                            🟡 Pending Approval (
                            {
                              spots.filter(
                                (spot) =>
                                  (spot.status || "pending") === "pending"
                              ).length
                            }
                            )
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {spots
                              .filter(
                                (spot) =>
                                  (spot.status || "pending") === "pending"
                              )
                              .map((spot) => (
                                <div
                                  key={spot._id}
                                  className={`border-2 rounded-lg p-4 ${
                                    (spot.status || "pending") === "pending"
                                      ? "border-yellow-200 bg-yellow-50"
                                      : spot.isActive
                                      ? "border-green-200 bg-green-50"
                                      : "border-red-200 bg-red-50 opacity-60"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                          spot.status || "pending"
                                        )}`}
                                      >
                                        {(spot.status || "pending")
                                          .charAt(0)
                                          .toUpperCase() +
                                          (spot.status || "pending").slice(1)}
                                      </span>
                                      {(spot.status || "pending") !==
                                        "pending" && (
                                        <span
                                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            spot.isActive
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {spot.isActive
                                            ? "Active"
                                            : "Disabled"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <img
                                    src={
                                      spot.images?.[0] ||
                                      "/placeholder-image.jpg"
                                    }
                                    alt={spot.title}
                                    className="w-full h-32 object-cover rounded mb-3"
                                  />
                                  <h3 className="font-medium">{spot.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {spot.location}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    By: {spot.ownerId?.name || "Unknown"}
                                  </p>
                                  <p className="text-lg font-bold text-green-600">
                                    ₱{spot.price.toLocaleString()}
                                  </p>
                                  <div className="mt-3 flex space-x-2">
                                    <button
                                      onClick={() => approveSpot(spot._id)}
                                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                    >
                                      ✅ Approve
                                    </button>
                                    <button
                                      onClick={() => rejectSpot(spot._id)}
                                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                    >
                                      ❌ Reject
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Approved and Rejected Spots Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">
                          📋 All Spots (
                          {
                            spots.filter(
                              (spot) => (spot.status || "pending") !== "pending"
                            ).length
                          }
                          )
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {spots
                            .filter(
                              (spot) => (spot.status || "pending") !== "pending"
                            )
                            .map((spot) => (
                              <div
                                key={spot._id}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                      spot.status || "pending"
                                    )}`}
                                  >
                                    {(spot.status || "pending")
                                      .charAt(0)
                                      .toUpperCase() +
                                      (spot.status || "pending").slice(1)}
                                  </span>
                                </div>
                                <img
                                  src={
                                    spot.images?.[0] || "/placeholder-image.jpg"
                                  }
                                  alt={spot.title}
                                  className="w-full h-32 object-cover rounded mb-3"
                                />
                                <h3 className="font-medium">{spot.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {spot.location}
                                </p>
                                <p className="text-sm text-gray-500">
                                  By: {spot.ownerId?.name || "Unknown"}
                                </p>
                                {spot.reviewedBy && (
                                  <p className="text-sm text-gray-500">
                                    Reviewed by: {spot.reviewedBy.name}
                                  </p>
                                )}
                                {spot.reviewNotes && (
                                  <p className="text-xs text-gray-600 mt-1 italic">
                                    "{spot.reviewNotes}"
                                  </p>
                                )}
                                <p className="text-lg font-bold text-green-600">
                                  ₱{spot.price.toLocaleString()}
                                </p>
                                <div className="mt-3 flex space-x-2">
                                  {(spot.status || "pending") ===
                                    "approved" && (
                                    <button
                                      onClick={() => deleteSpot(spot._id)}
                                      className={`px-3 py-1 text-white text-sm rounded hover:opacity-80 ${
                                        spot.isActive
                                          ? "bg-red-500 hover:bg-red-600"
                                          : "bg-green-500 hover:bg-green-600"
                                      }`}
                                    >
                                      {spot.isActive ? "Disable" : "Enable"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  All Bookings
                </h2>
                <p className="text-sm text-gray-500">
                  View all bookings across the entire system
                </p>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-6 text-center">Loading bookings...</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Spot
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Applied
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
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
