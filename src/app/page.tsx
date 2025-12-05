"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Spot {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  images: string[];
  amenities: string[];
}

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected";
  spotId: Spot;
}

export default function HomePage() {
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Always fetch all spots
        const spotsResponse = await fetch("/api/shared/spots");
        if (!spotsResponse.ok) {
          throw new Error(`HTTP error! status: ${spotsResponse.status}`);
        }
        const spotsData = await spotsResponse.json();

        if (spotsData.success) {
          setAllSpots(spotsData.data || []);
        } else {
          console.error("API returned success=false:", spotsData);
          setAllSpots([]);
        }

        // If user is logged in, fetch their applications
        if (session?.user) {
          const applicationsResponse = await fetch("/api/user/me");
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            if (applicationsData.success) {
              setUserApplications(applicationsData.data || []);
            }
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setAllSpots([]);
        setUserApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleApplyClick = (spotId: string) => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/features/spots/user/check-spot/${spotId}`);
  };

  // Get IDs of spots the user has applied for
  const appliedSpotIds = userApplications.map((app) => app.spotId._id);

  // Filter spots
  const availableSpots = allSpots.filter(
    (spot) => !appliedSpotIds.includes(spot._id)
  );
  const bookedSpots = allSpots.filter((spot) =>
    appliedSpotIds.includes(spot._id)
  );

  // Get application status for booked spots
  const getApplicationStatus = (spotId: string) => {
    const application = userApplications.find(
      (app) => app.spotId._id === spotId
    );
    return application?.status || "pending";
  };

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

  const SpotCard = ({
    spot,
    isBooked = false,
  }: {
    spot: Spot;
    isBooked?: boolean;
  }) => (
    <div
      key={spot._id}
      className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border"
    >
      {/* Image */}
      <img
        src={spot.images?.[0]}
        alt={spot.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        {/* Title & Category/Status */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">{spot.title}</h2>
          {isBooked ? (
            <span
              className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                getApplicationStatus(spot._id)
              )}`}
            >
              {getApplicationStatus(spot._id)}
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
              {spot.category}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="text-gray-500 text-sm mb-2">{spot.location}</p>

        {/* Description preview */}
        <p className="text-gray-700 text-sm line-clamp-3 mb-3">
          {spot.description}
        </p>

        {/* Price */}
        <p className="text-lg font-bold text-green-600 mb-4">
          ₱{spot.price.toLocaleString()}
        </p>

        {/* Action Button */}
        <button
          onClick={() => handleApplyClick(spot._id)}
          className={`w-full py-2 rounded transition ${
            isBooked
              ? "bg-gray-600 text-white hover:bg-gray-700"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isBooked ? "View Details" : session?.user ? "Apply" : "Check"}
        </button>
      </div>
    </div>
  );

  if (loading)
    return <p className="p-6 text-center text-lg">Loading spots...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {session?.user
          ? `Welcome back, ${session.user.name}!`
          : "Welcome to SafeTrip Explorer"}
      </h1>

      {session?.user ? (
        // Logged-in user view
        <>
          {/* Available Spots Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Available Spots</h2>
            {availableSpots.length === 0 ? (
              <p className="text-gray-600">
                No new spots available at the moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSpots.map((spot) => (
                  <SpotCard key={spot._id} spot={spot} />
                ))}
              </div>
            )}
          </div>

          {/* Booked Spots Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Booked Spots</h2>
            {bookedSpots.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-600 mb-4">
                  You haven't applied for any spots yet.
                </p>
                <a
                  href="#available-spots"
                  className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Browse Available Spots
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedSpots.map((spot) => (
                  <SpotCard key={spot._id} spot={spot} isBooked={true} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        // Guest user view (original behavior)
        <>
          <h2 className="text-2xl font-semibold mb-6">Available Spots</h2>
          {allSpots.length === 0 ? (
            <p>No spots available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSpots.map((spot) => (
                <SpotCard key={spot._id} spot={spot} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
