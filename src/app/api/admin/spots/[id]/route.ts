import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/authz";
import { z } from "zod";
import mongoose from "mongoose";

// SECURITY: Schema for updating spot data
const updateSpotSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  description: z.string().min(1).max(2000).optional(),
  location: z.string().min(1).max(255).optional(),
  category: z.string().min(1).max(100).optional(),
  price: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    // Find the spot and check if it belongs to the admin
    const spot = await TouristSpot.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!spot) {
      return NextResponse.json(
        { success: false, message: "Spot not found or access denied" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: spot });
  } catch (error) {
    console.error("Error fetching spot:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const body = await req.json();
    const parsed = updateSpotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid spot data" },
        { status: 400 },
      );
    }

    // Find the spot and check if it belongs to the admin
    const existingSpot = await TouristSpot.findOne({
      _id: id,
      ownerId: session!.user.id,
    });

    if (!existingSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found or access denied" },
        { status: 404 },
      );
    }

    if (existingSpot.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Only approved spots can be edited" },
        { status: 400 },
      );
    }

    // SECURITY: Whitelisted update - only update allowed fields
    const updateData = parsed.data;
    const updatedSpot = await TouristSpot.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      data: updatedSpot,
      message: "Spot updated successfully",
    });
  } catch (error) {
    console.error("Error updating spot:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    // Find the spot and check if it belongs to the admin
    const spot = await TouristSpot.findOne({
      _id: id,
      ownerId: session.user.id,
    });

    if (!spot) {
      return NextResponse.json(
        { success: false, message: "Spot not found or access denied" },
        { status: 404 },
      );
    }

    if (spot.status !== "approved") {
      return NextResponse.json(
        {
          success: false,
          message: "Only approved spots can be enabled/disabled",
        },
        { status: 400 },
      );
    }

    // Toggle the spot's active status (soft delete/enable)
    const updatedSpot = await TouristSpot.findByIdAndUpdate(
      id,
      [{ $set: { isActive: { $not: "$isActive" } } }],
      { new: true },
    );

    const action = updatedSpot?.isActive ? "enabled" : "disabled";
    return NextResponse.json({
      success: true,
      message: `Spot ${action} successfully`,
      data: { isActive: updatedSpot?.isActive },
    });
  } catch (error) {
    console.error("Error deleting spot:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
