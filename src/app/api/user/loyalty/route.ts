import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
import LoyaltyPoints from "@/services/models/LoyaltyPoints";
import connectDB from "@/lib/db";

// SECURITY: Server-side validation for loyalty point updates.
const loyaltyUpdateSchema = z.object({
  increment: z.number().int().min(0).default(1),
});

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

    // Get user's loyalty points, create if doesn't exist
    let loyaltyData = await LoyaltyPoints.findOne({ userId: session.user.id });

    if (!loyaltyData) {
      // Create loyalty points record with 0 points if user doesn't have one
      loyaltyData = await LoyaltyPoints.create({
        userId: session.user.id,
        points: 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        points: loyaltyData.points,
        userId: loyaltyData.userId,
      },
    });
  } catch (error) {
    console.error("Error fetching user loyalty points:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();
    const json = await request.json();
    const parsed = loyaltyUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid loyalty update data" },
        { status: 400 },
      );
    }

    const { increment } = parsed.data;

    // Get or create user's loyalty points record
    let loyaltyData = await LoyaltyPoints.findOne({ userId: session.user.id });

    if (!loyaltyData) {
      loyaltyData = await LoyaltyPoints.create({
        userId: session.user.id,
        points: 0,
      });
    }

    // Increment points
    loyaltyData.points += increment;
    await loyaltyData.save();

    return NextResponse.json({
      success: true,
      data: {
        points: loyaltyData.points,
        userId: loyaltyData.userId,
        incremented: increment,
      },
      message: `Loyalty points increased by ${increment}!`,
    });
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 },
    );
  }
}
