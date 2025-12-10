"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Application {
  _id: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  spotId: {
    _id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    price: number;
    images: string[];
  };
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface LoyaltyData {
  points: number;
  userId: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Application | null>(
    null
  );
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchApplications();
      fetchReviews();
      fetchLoyaltyData();
    }
  }, [session]);

  const fetchApplications = () => {
    fetch("/api/user/me")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("User applications:", data);
        if (data.success) {
          setApplications(data.data || []);
        } else {
          console.error("API returned success=false:", data);
          setApplications([]);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchReviews = () => {
    fetch("/api/user/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.data || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
      });
  };

  const fetchLoyaltyData = () => {
    fetch("/api/user/loyalty")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLoyaltyData(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching loyalty data:", error);
      });
  };

  const openReviewModal = (booking: Application) => {
    setSelectedBooking(booking);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedBooking || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          data.message ||
            "Review submitted successfully! You've earned 1 loyalty point!"
        );
        setShowReviewModal(false);
        setSelectedBooking(null);
        fetchReviews(); // Refresh reviews
        fetchLoyaltyData(); // Refresh loyalty points
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const hasReviewed = (bookingId: string) => {
    return reviews.some((review) => review._id === bookingId);
  };

  return (
    <div className="p-10">
      {/* Center the text horizontally */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
        <p className="mt-4 text-gray-600">
          Manage your spot applications and bookings.
        </p>
      </div>

      {/* Loyalty Points Section */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🏆 Loyalty Points</h2>
              <p className="text-purple-100 mt-1">
                Earn points by reviewing completed bookings
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">
                {loyaltyData?.points ?? 0}
              </div>
              <div className="text-purple-100 text-sm">Total Points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-x-4">
        {/* <a
          href="/profile"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Profile
        </a>

        <a
          href="/profile/change-password"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Change Password
        </a> */}
      </div>

      {/* Booked Spots Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">My Applications</h2>

        {loading ? (
          <p className="text-gray-600">Loading your applications...</p>
        ) : applications.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-4">
              You haven't applied for any spots yet.
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Browse Available Spots
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border"
              >
                {/* Spot Image */}
                <img
                  src={
                    application.spotId.images?.[0] || "/placeholder-image.jpg"
                  }
                  alt={application.spotId.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">
                      {application.spotId.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-gray-500 text-sm mb-2">
                    {application.spotId.location}
                  </p>

                  {/* Category */}
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mb-3 inline-block">
                    {application.spotId.category}
                  </span>

                  {/* Price */}
                  <p className="text-lg font-bold text-green-600 mb-3">
                    ₱{application.spotId.price.toLocaleString()}
                  </p>

                  {/* Applied Date */}
                  <p className="text-gray-500 text-xs">
                    Applied on{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-3 space-y-2">
                    <a
                      href={`/features/spots/user/check-spot/${application.spotId._id}`}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-purple-700 transition block text-center text-sm"
                    >
                      View Details
                    </a>

                    {application.status === "completed" &&
                      !hasReviewed(application._id) && (
                        <button
                          onClick={() => openReviewModal(application)}
                          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm"
                        >
                          ⭐ Write Review
                        </button>
                      )}

                    {application.status === "completed" &&
                      hasReviewed(application._id) && (
                        <div className="w-full bg-gray-100 text-gray-700 py-2 rounded text-center text-sm">
                          ✅ Review Submitted
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <p className="text-gray-600 mb-4">
              Share your experience at{" "}
              <strong>{selectedBooking.spotId.title}</strong>
            </p>

            {/* Rating Stars */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${
                      star <= reviewRating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {reviewRating} out of 5 stars
              </p>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Tell others about your experience..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewComment.length}/500 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
