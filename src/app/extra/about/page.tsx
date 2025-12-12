"use client";

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Mark Wendell M. Aquino",
      img: "https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/493260344_122160615110571086_4262538103597502125_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93&_nc_eui2=AeGkCSn5dOOPDZDSHNdROeJJznMKCPC4Zb7OcwoI8LhlvjWPOOdXIRCoscpPfpQnAzRl2IfCrmUWz8_cPeq9RkIL&_nc_ohc=2EfRcjr_AWMQ7kNvwFPH1VS&_nc_oc=AdkE3sTgP_uwKGHEVGlwlJO30yQPVaft70SVMv2xSEnt-GheQFjtSU5H8voG_wWNaN1vp-jffT_tR0mzwdbV2Ozg&_nc_zt=23&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=CTKi_wqEwBxwCdPQJ2VhOw&oh=00_AfmgdXJFvou-8561NTH-LgdmG5B-nUdlDknxfMJf9RtsgA&oe=69385DC2",
    },
    {
      name: "Moreno Jello",
      img: "https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-1/589017530_1470960144203081_6251310109186282458_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeFwGQYnznMk71VhigI19D0Lb2_khXmeNGFvb-SFeZ40YbAAHeBLL9p6qsjUh60j6_ciXbb_T03xBBGP2kpMqAOU&_nc_ohc=K30TvSOXp_EQ7kNvwGD3Nqt&_nc_oc=AdkjhwJvoCJaovN_AySKj4zzm1I5OsZjbIzO2jp6-yCq0uaNjQSZcO7r-Djy1tlp0aoBt82Gip0iykHBX-iYPKsZ&_nc_zt=24&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=TqMYsCWL1OwczmnFacG1Rw&oh=00_Afktm6icGHhrMvE6QxwZDtAz6IAGc7BmzD5sgsCbAaIvbg&oe=6938517C",
    },
    {
      name: "Princess Nicole Mercado",
      img: "https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/529200546_763762896594007_479117549778957720_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGHnFtWAdHZ92cbjt2r_YOD1bog-dPZN-3VuiD509k37Yf4RnUd8zWCMQKKcKhv-KSdDgrHmNkCkuD5kVNq_mji&_nc_ohc=Fcxfu7RuSQ4Q7kNvwEQnuje&_nc_oc=AdmR8XJtVloIhblRJLoo6zGfaEDiRSLumRNtt28td40rtzuhVFmOlq1Lm37sgdO5VTXBb-90yFn9fA01lA6r9Ku1&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=DnSKZ4eCZ8uAthafK2pNGQ&oh=00_AfnENWTzCK1-cEzxDhRuKjnomvHvGl4p6D5jx-mDcQcdoA&oe=6938562D",
    },
    {
      name: "Prinze Muyo",
      img: "https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-1/549258337_720715894321336_8851734021799582113_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGBRZ6O5Uqywyc3at7zSDS7V0dwDn2L4VpXR3AOfYvhWgU1j32DJKsuD6pANa0sx6dOxhwIxMrGGaCmV1xt3_Sf&_nc_ohc=iz3VY4D-LuQQ7kNvwHsPYF1&_nc_oc=AdlGTh9Y2pO9eDAQVh3vQEKPvUC7JmDU-3EclHSvYpKq5zEyfCFPKhSZG91-i_2uiEN7US5Q7xvCpg7VBBcMq-5c&_nc_zt=24&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=Zzqq1fqwrf1YdAG8jHYApw&oh=00_Afnh2p5eswpPk8fNvLUjFwOku946whWr-O4gI3Tdqh9IIg&oe=69386EE8",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        About SafeTrip Explorer
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-base mb-6 leading-relaxed">
        SafeTrip Explorer is a web and mobile booking system designed to help
        users discover and reserve the best travel spots in the Philippines.
        Created by BSIT – Mobile & Web Application students, this platform
        streamlines the travel planning process with an intuitive and
        user-friendly interface.
      </p>

      {/* Purpose */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Purpose</h2>
        <p className="text-gray-600 leading-relaxed">
          The system aims to simplify travel planning, enabling users to easily
          find available spots, view details, and book trips safely and
          efficiently. It is also intended as a learning project for students to
          apply practical web and mobile development skills.
        </p>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Browse available travel spots with images and details</li>
          <li>View location, description, amenities, and pricing</li>
          <li>Book trips directly from the platform</li>
          <li>Rate and review visited spots</li>
          <li>User authentication for a personalized experience</li>
          <li>Responsive design for both web and mobile devices</li>
        </ul>
      </div>

      {/* Team Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Our Team
        </h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center text-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white hover:scale-105 transition-transform"
              />
              <p className="text-sm mt-3 font-semibold text-gray-800">
                {member.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
