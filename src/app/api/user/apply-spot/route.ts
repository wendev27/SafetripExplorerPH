import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";

// SECURITY: Schema for user spot applications.
const applySpotSchema = z.object({
  spotId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );

  const json = await req.json();

  const parsed = applySpotSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid application data" },
      { status: 400 },
    );
  }

  const { spotId } = parsed.data;

  // SECURITY: Ensure we only accept valid MongoDB ObjectIds.
  if (!mongoose.Types.ObjectId.isValid(spotId)) {
    return NextResponse.json(
      { success: false, message: "Invalid spot ID" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    // Check if user already applied for this spot
    const existingApplication = await UserApplication.findOne({
      userId: session.user.id,
      spotId,
    });

    if (existingApplication) {
      return NextResponse.json({
        success: false,
        message: "You have already applied for this spot",
      });
    }

    // Create new application directly
    const newApp = await UserApplication.create({
      spotId,
      userId: session.user.id,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      data: newApp,
      message: "Application submitted successfully!",
    });
  } catch (err) {
    console.error("Error creating application:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
