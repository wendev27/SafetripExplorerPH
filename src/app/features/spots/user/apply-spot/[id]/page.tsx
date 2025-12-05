"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ApplySpotPage() {
  const { id } = useParams(); // Get ID from URL
  const router = useRouter();
  const [spot, setSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/shared/apply-spot/${id}`) // Fetch single spot
      .then((res) => res.json())
      .then((data) => setSpot(data.data || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!spot) return <p className="p-6">Spot not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 underline mb-4"
      >
        ← Back
      </button>

      {/* IMAGE */}
      <img
        src={spot.images?.[0]}
        className="w-full h-60 object-cover rounded-xl mb-4"
      />

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">{spot.title}</h1>

      {/* LOCATION */}
      <p className="text-gray-500 mb-4">{spot.location}</p>

      {/* CATEGORY */}
      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
        {spot.category}
      </span>

      {/* DESCRIPTION */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Description</h2>
        <p>{spot.description}</p>
      </div>

      {/* AMENITIES */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Amenities</h2>
        <ul className="list-disc ml-6">
          {spot.amenities?.map((a: string, i: number) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      {/* PRICE */}
      <p className="text-2xl font-bold text-green-600 mt-6">
        ₱{spot.price.toLocaleString()}
      </p>

      {/* APPLY BUTTON */}
      <button
        className="w-full bg-purple-600 text-white py-3 rounded mt-6 hover:bg-purple-700"
        onClick={() => alert("Apply flow coming next")}
      >
        Apply for this Spot
      </button>
    </div>
  );
}
