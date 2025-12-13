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
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) setSpot(data.data);
        else setSpot(null);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setSpot(null);
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

  return (
    <div className="h-[600px] mt-[100px] flex flex-col justify-between p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
        >
          <span className="text-xl">←</span>
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex justify-center items-center h-64">
            Loading spot...
          </div>
        ) : spot ? (
          <>
            {/* Images */}
            {spot.images?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 rounded-xl overflow-hidden">
                {spot.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={spot.title ?? "Spot image"}
                    className="w-full h-56 object-cover rounded-xl shadow-sm"
                  />
                ))}
              </div>
            )}

            {/* Spot Card */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">
                {spot.title ?? "Untitled"}
              </h1>
              <p className="text-gray-500 mb-4 text-sm">
                {spot.location ?? "No location"}
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {spot.description ?? "No description"}
              </p>
              <p className="text-2xl font-semibold text-green-600 mb-6">
                ₱{spot.price?.toLocaleString() ?? "0"}
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
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center h-64 flex items-center justify-center">
            Spot not found
          </div>
        )}
      </div>
    </div>
  );
}
