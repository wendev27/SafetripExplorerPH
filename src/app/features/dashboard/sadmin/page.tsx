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
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold tracking-tight">Super Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Control Center</p>
        </div>

        {/* NAV */}
        <nav className="flex-1 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-5 py-3 text-sm font-medium rounded-r-full transition-all
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 max-w-7xl mx-auto">
        {/* HEADER CARD */}
        <header className="bg-white rounded-xl shadow p-8 mb-8 border">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {session?.user?.name}</p>
        </header>

        {/* TAB CONTENT */}
        <section className="space-y-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* USERS */}
              <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    👥
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{users.length || "…"}</p>
                  </div>
                </div>
              </div>

              {/* SPOTS */}
              <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                    🏖️
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Spots</p>
                    <p className="text-2xl font-bold">{spots.length || "…"}</p>
                  </div>
                </div>
              </div>

              {/* BOOKINGS */}
              <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center">
                    📅
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <p className="text-2xl font-bold">
                      {bookings.length || "…"}
                    </p>
                  </div>
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
                    👑
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">System Status</p>
                    <p className="text-xl font-bold text-green-600">Online</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-lg font-bold mb-4">Users</h2>

              <div className="overflow-auto rounded-lg border">
                {loading ? (
                  <div className="p-6 text-center">Loading...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left">User</th>
                        <th className="px-6 py-3 text-left">Role</th>
                        <th className="px-6 py-3 text-left">Joined</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b">
                          <td className="px-6 py-4">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500">{user.email}</div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                user.userRole
                              )}`}
                            >
                              {user.userRole}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4 space-x-2">
                            <select
                              value={user.userRole}
                              onChange={(e) =>
                                updateUserRole(user._id, e.target.value)
                              }
                              className="border rounded px-2 py-1 text-xs"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>

                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => deleteUser(user._id)}
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

          {/* SPOTS & BOOKINGS TABS */}
          {/* Keep your exact existing code below this point */}
        </section>
      </div>
    </div>
  );
}
