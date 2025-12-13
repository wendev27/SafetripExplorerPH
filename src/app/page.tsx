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
      const spotsRes = await fetch("/api/shared/spots");
      const spotsData = await spotsRes.json();
      const spotsList = spotsData.data || [];

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

  return (
    <div className="min-h-screen overflow-auto">
      {/* Hero Section */}
      <section className="hero relative text-center py-36">
        <div className="hero-video-container absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <video
            autoPlay
            muted
            loop
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover filter grayscale-20"
          >
            <source
              src="/Welcome Back to the Philippines!.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
        </div>

        <div className="container relative z-20 text-white">
          <h1 className="text-5xl font-bold mb-4">Discover the Philippines</h1>
          <p className="text-lg mb-6">
            Experience the Pearl of the Orient Seas with safety and
            unforgettable beauty.
          </p>
          <a
            href="#gallery"
            className="book-now inline-block py-2 px-6 rounded-full bg-yellow-400 text-blue-900 font-bold"
          >
            Explore Our Top Destinations
          </a>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section py-20 bg-white" id="gallery">
        <div className="container mx-auto text-center">
          <h2 className="section-title text-3xl font-bold mb-6 text-blue-900">
            🏖️ Philippine Destination Gallery
          </h2>
          <p className="text-gray-600 mb-10">
            Browse our curated list of safe, stunning, and must-see locations.
            Hover to see details!
          </p>

          <div className="gallery-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="gallery-item relative rounded-lg overflow-hidden shadow hover:scale-105 transition">
              <img
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg"
                alt="Palawan El Nido"
                className="w-full h-64 object-cover"
              />
              <div className="gallery-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 text-white p-4">
                <h3 className="text-xl font-semibold">Palawan</h3>
                <p>
                  El Nido's stunning limestone cliffs and crystal-clear lagoons.
                </p>
              </div>
            </div>
            <div className="gallery-item relative rounded-lg overflow-hidden shadow hover:scale-105 transition">
              <img
                src="/qw.jpg"
                alt="Boracay White Beach"
                className="w-full h-64 object-cover"
              />
              <div className="gallery-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 text-white p-4">
                <h3 className="text-xl font-semibold">Boracay</h3>
                <p>
                  World-famous White Beach with powdery sand and vibrant
                  nightlife.
                </p>
              </div>
            </div>
            <div className="gallery-item relative rounded-lg overflow-hidden shadow hover:scale-105 transition">
              <img
                src="/as.jpg"
                alt="Bohol Chocolate Hills"
                className="w-full h-64 object-cover"
              />
              <div className="gallery-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 text-white p-4">
                <h3 className="text-xl font-semibold">Bohol</h3>
                <p>
                  The mysterious Chocolate Hills formation and the tiny Tarsier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Experiences Section */}
      <section
        className="travel-experiences-grid py-20 bg-gray-100"
        id="activities"
      >
        <div className="container mx-auto text-center">
          <h2 className="section-title text-3xl font-bold mb-10 text-blue-900">
            🗺️ Philippine Travel Experiences
          </h2>
          <div className="ph-elements-container flex justify-center flex-wrap gap-8">
            <div className="ph-element bg-white p-6 rounded-lg shadow text-center border-b-4 border-red-600 hover:border-blue-900 transition transform hover:-translate-y-2">
              <i className="fas fa-water text-4xl text-blue-900 mb-2 block"></i>
              <span className="font-semibold">Island Hopping & Diving</span>
            </div>
            <div className="ph-element bg-white p-6 rounded-lg shadow text-center border-b-4 border-red-600 hover:border-blue-900 transition transform hover:-translate-y-2">
              <i className="fas fa-utensils text-4xl text-blue-900 mb-2 block"></i>
              <span className="font-semibold">Authentic Food Tours</span>
            </div>
            <div className="ph-element bg-white p-6 rounded-lg shadow text-center border-b-4 border-red-600 hover:border-blue-900 transition transform hover:-translate-y-2">
              <i className="fas fa-hiking text-4xl text-blue-900 mb-2 block"></i>
              <span className="font-semibold">Volcano & Mountain Trekking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Trip Section */}
      <section id="plan" className="py-20 bg-blue-900 text-white text-center">
        <div className="container mx-auto">
          <h2 className="section-title text-3xl font-bold mb-6">
            ✈️ Plan Your Philippine Trip
          </h2>
          <p className="mb-6">
            Start planning your dream vacation now. We connect you with trusted
            local guides and safe accommodations.
          </p>
          <a
            href="#book"
            className="book-now inline-block py-2 px-6 rounded-full bg-yellow-400 text-blue-900 font-bold"
          >
            Get a Quote
          </a>
        </div>
      </section>

      {/* Travel Tips Section */}
      <section id="tips" className="py-20 bg-white text-center">
        <div className="container mx-auto">
          <h2 className="section-title text-3xl font-bold mb-10 text-blue-900">
            💡 Essential Philippine Travel Tips
          </h2>
          <ul className="flex flex-wrap justify-center gap-10 list-none">
            <li>Best time to visit: November–April</li>
            <li>Try local dishes: Adobo, Sinigang, Lechon</li>
            <li>Carry cash: Not all places accept cards</li>
            <li>Learn a few basic Tagalog phrases</li>
          </ul>
        </div>
      </section>

      {/* Dynamic Spots Section */}
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            Available Spots
          </h1>

          {loading ? (
            <div className="h-[700px] animate-pulse bg-gray-200 rounded-xl text-center p-6">
              Loading spots...
            </div>
          ) : spots.length === 0 ? (
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
