// src/app/features/spots/user/check-spot/[id]/page.tsx

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
    fetch(`/api/shared/spots?id=${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Spot API Response:", data); // Debug log
        if (data.success) {
          setSpot(data.data);
        } else {
          console.error("API returned success=false:", data);
          setSpot(null);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setSpot(null); // or handle error state
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    setApplying(true);

    try {
      const res = await fetch("/api/user/apply-spot", {
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
      >
        <span className="text-xl">←</span>
        <span className="font-medium">Back</span>
      </button>

      {/* Images */}
      {spot.images?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 rounded-xl overflow-hidden">
          {spot.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={spot.title}
              className="w-full h-56 object-cover rounded-xl shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Content Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{spot.title}</h1>
        <p className="text-gray-500 mb-4 text-sm">{spot.location}</p>

        <p className="text-gray-700 mb-6 leading-relaxed">{spot.description}</p>

        <p className="text-2xl font-semibold text-green-600 mb-6">
          ₱{spot.price.toLocaleString()}
        </p>

        {/* Amenities */}
        {spot.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {spot.amenities.map((a, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100"
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md"
        >
          {applying ? "Applying..." : "Apply for this Spot"}
        </button>
      </div>
    </div>
  );
}
