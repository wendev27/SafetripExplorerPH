"use client";

import { useEffect, useState } from "react";

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

export default function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    fetch("/api/shared/spots")
      .then((res) => res.json())
      .then((data) => setSpots(data.spots || [])) // avoid undefined
      .catch(() => setSpots([]));
  }, []);

  useEffect(() => {
    fetch("/api/shared/spots")
      .then((res) => res.json())
      .then((data) => setSpots(data.data || [])); // <-- FIX HERE
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Available Spots</h1>

      {spots.length === 0 ? (
        <p>No spots available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <div
              key={spot._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden border"
            >
              {/* Image */}
              <img
                src={spot.images?.[0]}
                alt={spot.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                {/* Title + Category */}
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{spot.title}</h2>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-lg">
                    {spot.category}
                  </span>
                </div>

                {/* Location */}
                <p className="text-gray-600 text-sm mb-2">{spot.location}</p>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                  {spot.description}
                </p>

                {/* Price */}
                <p className="text-lg font-bold text-green-600 mb-3">
                  ₱{spot.price.toLocaleString()}
                </p>

                {/* Amenities */}
                {spot.amenities && spot.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {spot.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-lg"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
