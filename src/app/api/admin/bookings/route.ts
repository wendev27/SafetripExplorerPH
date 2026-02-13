import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  const session = await getServerSession(authOptions);

  const authResp = requireAdmin(session);
  if (authResp) return authResp;

  try {
    await connectDB();

    // Get all bookings for spots owned by this admin
    const bookings = await UserApplication.find({})
      .populate({
        path: "spotId",
        model: "TouristSpot",
        match: { ownerId: session!.user.id }, // Only spots owned by this admin
        select: "title location price",
      })
      .populate({
        path: "userId",
        model: "User",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    // Filter out bookings where spotId is null (not owned by this admin)
    const adminBookings = bookings.filter((booking) => booking.spotId !== null);

    return NextResponse.json({ success: true, data: adminBookings });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
