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

  // Fetch data depending on active tab
  useEffect(() => {
    switch (activeTab) {
      case "users":
        fetchUsers();
        break;
      case "spots":
        fetchSpots();
        break;
      case "bookings":
        fetchBookings();
        break;
    }
  }, [activeTab]);

  // -------- FETCH FUNCTIONS --------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sadmin/users");
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sadmin/spots");
      const data = await res.json();
      if (data.success) setSpots(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sadmin/bookings");
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------- ACTION FUNCTIONS --------
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/sadmin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/sadmin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSpotStatus = async (spotId: string) => {
    if (!confirm("Toggle spot active status?")) return;
    try {
      const res = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "DELETE",
      });
      if (res.ok) fetchSpots();
    } catch (err) {
      console.error(err);
    }
  };

  const approveSpot = async (spotId: string) => {
    const notes = prompt("Review notes (optional):");
    if (notes === null) return;
    try {
      const res = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", reviewNotes: notes }),
      });
      if (res.ok) fetchSpots();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectSpot = async (spotId: string) => {
    const notes = prompt("Rejection reason:");
    if (!notes) return alert("Reason required");
    try {
      const res = await fetch(`/api/sadmin/spots/${spotId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reviewNotes: notes }),
      });
      if (res.ok) fetchSpots();
    } catch (err) {
      console.error(err);
    }
  };

  // -------- UTIL FUNCTIONS --------
  const getRoleColor = (role: string) => {
    if (role === "superadmin") return "bg-purple-100 text-purple-800";
    if (role === "admin") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    if (status === "approved" || status === "accepted")
      return "bg-green-100 text-green-800";
    if (status === "rejected") return "bg-red-100 text-red-800";
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "📊" },
    { id: "users" as TabType, label: "Manage Users", icon: "👥" },
    { id: "spots" as TabType, label: "Manage Spots", icon: "🏖️" },
    { id: "bookings" as TabType, label: "All Bookings", icon: "📅" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold">Super Admin</h1>
          <p className="text-xs text-gray-500">Control Center</p>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-5 py-3 text-sm font-medium rounded-r-full transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="bg-white rounded-xl shadow p-8 mb-8 border">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {session?.user?.name}</p>
        </header>

        <section className="space-y-8">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Users"
                count={users.length}
                icon="👥"
                color="blue"
              />
              <DashboardCard
                title="Total Spots"
                count={spots.length}
                icon="🏖️"
                color="green"
              />
              <DashboardCard
                title="Total Bookings"
                count={bookings.length}
                icon="📅"
                color="yellow"
              />
              <DashboardCard
                title="System Status"
                count="Online"
                icon="👑"
                color="purple"
              />
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <TableCard
              title="Users"
              loading={loading}
              columns={["User", "Role", "Joined", "Actions"]}
            >
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
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
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
            </TableCard>
          )}

          {activeTab === "spots" && (
            <TableCard
              title="Spots"
              loading={loading}
              columns={[
                "Title",
                "Location",
                "Price",
                "Owner",
                "Status",
                "Actions",
              ]}
            >
              {spots.map((spot) => (
                <tr key={spot._id} className="border-b">
                  <td className="px-6 py-4">{spot.title}</td>
                  <td className="px-6 py-4">{spot.location}</td>
                  <td className="px-6 py-4">₱{spot.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{spot.ownerId.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        spot.status
                      )}`}
                    >
                      {spot.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => approveSpot(spot._id)}
                      className="bg-green-500 px-2 py-1 text-white rounded text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectSpot(spot._id)}
                      className="bg-red-500 px-2 py-1 text-white rounded text-xs"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => toggleSpotStatus(spot._id)}
                      className="bg-gray-500 px-2 py-1 text-white rounded text-xs"
                    >
                      {spot.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </TableCard>
          )}

          {activeTab === "bookings" && (
            <TableCard
              title="Bookings"
              loading={loading}
              columns={["User", "Spot", "Status", "Applied"]}
            >
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b">
                  <td className="px-6 py-4">{booking.userId.name}</td>
                  <td className="px-6 py-4">{booking.spotId.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </TableCard>
          )}
        </section>
      </main>
    </div>
  );
}

// -------- REUSABLE COMPONENTS --------
function DashboardCard({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number | string;
  icon: string;
  color: string;
}) {
  const bgColor = `bg-${color}-500`;
  return (
    <div className="bg-white rounded-xl shadow p-6 border hover:shadow-md transition">
      <div className="flex items-center">
        <div
          className={`${bgColor} text-white w-10 h-10 rounded-full flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
}

function TableCard({
  title,
  loading,
  columns,
  children,
}: {
  title: string;
  loading: boolean;
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="overflow-auto rounded-lg border max-h-[400px]">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-6 py-3 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
