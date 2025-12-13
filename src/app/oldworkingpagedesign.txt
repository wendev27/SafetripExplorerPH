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
  averageRating?: number;
  totalReviews?: number;
}

export default function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchSpotsWithReviews();
  }, []);

  const fetchSpotsWithReviews = async () => {
    setLoading(true);
    try {
      // Fetch spots
      const spotsRes = await fetch("/api/shared/spots");
      const spotsData = await spotsRes.json();
      const spotsList = spotsData.data || [];

      // Fetch reviews for each spot
      const spotsWithReviews = await Promise.all(
        spotsList.map(async (spot: Spot) => {
          try {
            const reviewsRes = await fetch(`/api/reviews?spotId=${spot._id}`);
            const reviewsData = await reviewsRes.json();
            if (reviewsData.success) {
              return {
                ...spot,
                averageRating: reviewsData.data.averageRating,
                totalReviews: reviewsData.data.totalReviews,
              };
            }
          } catch (error) {
            console.error(
              `Error fetching reviews for spot ${spot._id}:`,
              error
            );
          }
          return spot;
        })
      );

      setSpots(spotsWithReviews);
    } catch (error) {
      console.error("Error fetching spots:", error);
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (spotId: string) => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/features/spots/user/check-spot/${spotId}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ⭐
          </span>
        ))}
        <span className="text-xs text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading)
    return (
      <div className="h-[700px] animate-pulse bg-gray-200 rounded-xl">
        <p className="p-6 text-center text-lg">Loading spots...</p>;
      </div>
    );

  return (
    <div className="min-h-screen overflow-auto">
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900">
              Welcome to SafeTrip Explorer
            </h1>
          </div>

          {/* Spots Section */}
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Available Spots
          </h1>

          {spots.length === 0 ? (
            <p className="text-gray-500">No spots available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {spots.map((spot) => (
                <div
                  key={spot._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden border border-gray-200"
                >
                  <img
                    src={spot.images?.[0]}
                    alt={spot.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {spot.title}
                      </h2>
                      <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                        {spot.category}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm mb-2">
                      {spot.location}
                    </p>

                    <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                      {spot.description}
                    </p>

                    {/* Rating */}
                    {spot.averageRating !== undefined &&
                      spot.totalReviews !== undefined &&
                      spot.totalReviews > 0 && (
                        <div className="mb-3 flex items-center">
                          {renderStars(spot.averageRating)}
                          <span className="text-xs text-gray-500 ml-2">
                            {spot.totalReviews} review
                            {spot.totalReviews !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}

                    <p className="text-lg font-bold text-green-600 mb-4">
                      ₱{spot.price.toLocaleString()}
                    </p>

                    <button
                      onClick={() => handleApplyClick(spot._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transition transform font-medium shadow"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
