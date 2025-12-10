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

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: {
    name: string;
  };
}

interface ReviewsData {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export default function SpotPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSpot();
    fetchReviews();
  }, [id]);

  const fetchSpot = () => {
    fetch(`/api/shared/spots/${id}`)
      .then((res) => res.json())
      .then((data) => setSpot(data.data))
      .finally(() => setLoading(false));
  };

  const fetchReviews = () => {
    setReviewsLoading(true);
    fetch(`/api/reviews?spotId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviewsData(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      })
      .finally(() => setReviewsLoading(false));
  };

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

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "text-lg" : "text-xl";
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${starSize} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Reviews Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>

        {reviewsLoading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviewsData ? (
          <>
            {/* Rating Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {reviewsData.averageRating}
                  </div>
                  {renderStars(Math.round(reviewsData.averageRating), "md")}
                  <div className="text-sm text-gray-600 mt-1">
                    {reviewsData.totalReviews} review{reviewsData.totalReviews !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    Average rating from {reviewsData.totalReviews} visitor{reviewsData.totalReviews !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            {reviewsData.reviews.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Reviews</h3>
                {reviewsData.reviews.map((review) => (
                  <div key={review._id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {review.userId.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{review.userId.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No reviews yet. Be the first to review after visiting!</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>Unable to load reviews at this time.</p>
          </div>
        )}
      </div>

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
