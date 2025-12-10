import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Review from "@/services/models/Review";
import connectDB from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Get all reviews by this user
    const reviews = await Review.find({ userId: session.user.id })
      .populate({
        path: "spotId",
        model: "TouristSpot",
        select: "title location images",
      })
      .populate({
        path: "bookingId",
        model: "UserApplication",
        select: "status createdAt",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
