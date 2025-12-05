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

export default function HomePage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    fetch("/api/shared/spots")
      .then((res) => res.json())
      .then((data) => setSpots(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyClick = (spotId: string) => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    router.push(`/features/spots/user/check-spot/${spotId}`);
  };

  if (loading)
    return <p className="p-6 text-center text-lg">Loading spots...</p>;

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          Welcome to SafeTrip Explorer
        </h1>
        <p className="text-gray-600 text-sm">
          Created by BSIT – Mobile & Web Application Students
        </p>

        {/* Team Images */}
        <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <div className="flex flex-col items-center text-center">
            <img
              src="https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/493260344_122160615110571086_4262538103597502125_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGkCSn5dOOPDZDSHNdROeJJznMKCPC4Zb7OcwoI8LhlvjWPOOdXIRCoscpPfpQnAzRl2IfCrmUWz8_cPeq9RkIL&_nc_ohc=2EfRcjr_AWMQ7kNvwFPH1VS&_nc_oc=AdkE3sTgP_uwKGHEVGlwlJO30yQPVaft70SVMv2xSEnt-GheQFjtSU5H8voG_wWNaN1vp-jffT_tR0mzwdbV2Ozg&_nc_zt=23&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=CTKi_wqEwBxwCdPQJ2VhOw&oh=00_AfmgdXJFvou-8561NTH-LgdmG5B-nUdlDknxfMJf9RtsgA&oe=69385DC2"
              className="w-20 h-20 rounded-full object-cover shadow"
            />
            <p className="text-xs mt-2 font-medium">Mark Wendell M. Aquino</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-1/589017530_1470960144203081_6251310109186282458_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFwGQYnznMk71VhigI19D0Lb2_khXmeNGFvb-SFeZ40YbAAHeBLL9p6qsjUh60j6_ciXbb_T03xBBGP2kpMqAOU&_nc_ohc=K30TvSOXp_EQ7kNvwGD3Nqt&_nc_oc=AdkjhwJvoCJaovN_AySKj4zzm1I5OsZjbIzO2jp6-yCq0uaNjQSZcO7r-Djy1tlp0aoBt82Gip0iykHBX-iYPKsZ&_nc_zt=24&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=TqMYsCWL1OwczmnFacG1Rw&oh=00_Afktm6icGHhrMvE6QxwZDtAz6IAGc7BmzD5sgsCbAaIvbg&oe=6938517C"
              className="w-20 h-20 rounded-full object-cover shadow"
            />
            <p className="text-xs mt-2 font-medium">Moreno Jello</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src="https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/529200546_763762896594007_479117549778957720_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGHnFtWAdHZ92cbjt2r_YOD1bog-dPZN-3VuiD509k37Yf4RnUd8zWCMQKKcKhv-KSdDgrHmNkCkuD5kVNq_mji&_nc_ohc=Fcxfu7RuSQ4Q7kNvwEQnuje&_nc_oc=AdmR8XJtVloIhblRJLoo6zGfaEDiRSLumRNtt28td40rtzuhVFmOlq1Lm37sgdO5VTXBb-90yFn9fA01lA6r9Ku1&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=DnSKZ4eCZ8uAthafK2pNGQ&oh=00_AfnENWTzCK1-cEzxDhRuKjnomvHvGl4p6D5jx-mDcQcdoA&oe=6938562D"
              className="w-20 h-20 rounded-full object-cover shadow"
            />
            <p className="text-xs mt-2 font-medium">Princess Nicole Mercado</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <img
              src="https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-1/549258337_720715894321336_8851734021799582113_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGBRZ6O5Uqywyc3at7zSDS7V0dwDn2L4VpXR3AOfYvhWgU1j32DJKsuD6pANa0sx6dOxhwIxMrGGaCmV1xt3_Sf&_nc_ohc=iz3VY4D-LuQQ7kNvwHsPYF1&_nc_oc=AdlGTh9Y2pO9eDAQVh3vQEKPvUC7JmDU-3EclHSvYpKq5zEyfCFPKhSZG91-i_2uiEN7US5Q7xvCpg7VBBcMq-5c&_nc_zt=24&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=Zzqq1fqwrf1YdAG8jHYApw&oh=00_Afnh2p5eswpPk8fNvLUjFwOku946whWr-O4gI3Tdqh9IIg&oe=69386EE8"
              className="w-20 h-20 rounded-full object-cover shadow"
            />
            <p className="text-xs mt-2 font-medium">Prinze Muyo</p>
          </div>
        </div>
      </div>

      {/* Spots Section */}
      <h1 className="text-3xl font-bold mb-6">Available Spots</h1>

      {spots.length === 0 ? (
        <p>No spots available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <div
              key={spot._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden border"
            >
              <img
                src={spot.images?.[0]}
                alt={spot.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{spot.title}</h2>
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                    {spot.category}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-2">{spot.location}</p>

                <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                  {spot.description}
                </p>

                <p className="text-lg font-bold text-green-600 mb-4">
                  ₱{spot.price.toLocaleString()}
                </p>

                <button
                  onClick={() => handleApplyClick(spot._id)}
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
