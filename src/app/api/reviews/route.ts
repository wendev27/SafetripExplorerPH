import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import Review from "@/services/models/Review";
import UserApplication from "@/services/models/UserApplication";
import connectDB from "@/lib/db";

// SECURITY: Schema for creating reviews.
const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500),
  isAnonymous: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const spotId = searchParams.get("spotId");

    if (!spotId) {
      return NextResponse.json(
        { success: false, message: "spotId parameter is required" },
        { status: 400 }
      );
    }

    // SECURITY: Validate the spotId as an ObjectId to avoid malformed queries.
    if (!mongoose.Types.ObjectId.isValid(spotId)) {
      return NextResponse.json(
        { success: false, message: "Invalid spotId parameter" },
        { status: 400 }
      );
    }

    // Get all reviews for this spot
    const reviews = await Review.find({ spotId })
      .populate({
        path: "userId",
        model: "User",
        select: "name"
      })
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const json = await request.json();
    const parsed = reviewSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid review data",
        },
        { status: 400 }
      );
    }

    const { bookingId, rating, comment, isAnonymous = false } = parsed.data;

    // SECURITY: Validate bookingId format
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json(
        { success: false, message: "Invalid booking ID" },
        { status: 400 }
      );
    }

    // Check if the booking exists and belongs to the user
    const booking = await UserApplication.findOne({
      _id: bookingId,
      userId: session.user.id,
      status: "completed" // Only allow reviews for completed bookings
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found or not eligible for review" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this booking" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await Review.create({
      bookingId,
      userId: session.user.id,
      spotId: booking.spotId,
      rating,
      comment: comment.trim(),
      isAnonymous,
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: "Review submitted successfully!"
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
