import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Review from "@/services/models/Review";
import connectDB from "@/lib/db";
import { useApiToast } from "@/hooks/use-api-toast";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
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
    const { apiCall } = useApiToast();

    const result = await apiCall(
      async () => {
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

        return reviews;
      },
      {
        successMessage: "Reviews loaded successfully!",
        errorMessage: "Failed to load reviews. Please try again.",
      },
    );

    if (result) {
      return NextResponse.json({ success: true, data: result });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to load reviews",
      });
    }
  }
}
