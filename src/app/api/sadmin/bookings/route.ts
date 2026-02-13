import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";
import connectDB from "@/lib/db";
import { requireSuperAdmin } from "@/lib/authz";

export async function GET() {
  const session = await getServerSession(authOptions);

  const authResp = requireSuperAdmin(session);
  if (authResp) return authResp;

  try {
    await connectDB();

    const bookings = await UserApplication.find({})
      .populate({
        path: "userId",
        model: "User",
        select: "name email role",
      })
      .populate({
        path: "spotId",
        model: "TouristSpot",
        select: "title location price ownerId",
      })
      .sort({ createdAt: -1 });

    // Transform role to userRole for frontend consistency
    const transformedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      userId: booking.userId
        ? {
            ...booking.userId.toObject(),
            userRole: booking.userId.role,
          }
        : booking.userId,
    }));

    return NextResponse.json({ success: true, data: transformedBookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
