"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function SpotPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/shared/spots/${id}`)
      .then((res) => res.json())
      .then((data) => setSpot(data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    setApplying(true);

    try {
      const res = await fetch("/api/shared/apply-spot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotId: id }),
      });
      const data = await res.json();
      if (data.success) alert("Application submitted!");
      else alert(data.message || "Error applying");
    } catch {
      alert("Error applying");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="p-6">Loading spot...</p>;
  if (!spot) return <p className="p-6">Spot not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        &larr; Back
      </button>

      {/* Spot Images */}
      {spot.images && spot.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {spot.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={spot.title}
              className="w-full h-48 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Spot Info */}
      <h1 className="text-3xl font-bold mb-2">{spot.title}</h1>
      <p className="text-gray-600 mb-2">{spot.location}</p>
      <p className="text-gray-700 mb-4">{spot.description}</p>
      <p className="text-green-600 font-bold mb-4">
        ₱{spot.price.toLocaleString()}
      </p>

      {/* Amenities */}
      {spot.amenities && spot.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {spot.amenities.map((a, i) => (
            <span
              key={i}
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-sm"
            >
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={applying}
        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
      >
        {applying ? "Applying..." : "Apply for this Spot"}
      </button>
    </div>
  );
}
