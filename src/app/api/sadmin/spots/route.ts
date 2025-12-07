import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "superadmin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const spots = await TouristSpot.find({})
      .populate({
        path: "ownerId",
        model: "User",
        select: "name email role",
      })
      .sort({ createdAt: -1 });

    // Transform role to userRole for frontend consistency
    const transformedSpots = spots.map((spot) => ({
      ...spot.toObject(),
      ownerId: spot.ownerId
        ? {
            ...spot.ownerId.toObject(),
            userRole: spot.ownerId.role,
          }
        : spot.ownerId,
    }));

    return NextResponse.json({ success: true, data: transformedSpots });
  } catch (error) {
    console.error("Error fetching all spots:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
