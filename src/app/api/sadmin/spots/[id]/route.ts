import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import mongoose from "mongoose";
import { requireSuperAdmin } from "@/lib/authz";
import { z } from "zod";
import { logApiError, internalError } from "@/lib/api-errors";

// SECURITY: Schema for spot approval/rejection
const spotApprovalSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reviewNotes: z.string().max(500).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  const authResp = requireSuperAdmin(session);
  if (authResp) return authResp;

  const { id } = await params;

  // SECURITY: Validate ObjectId format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid spot ID" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const body = await req.json();
    const parsed = spotApprovalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid approval data" },
        { status: 400 },
      );
    }

    const { action, reviewNotes } = parsed.data;

    if (!session!.user?.id) {
      return NextResponse.json(
        { success: false, message: "User session invalid" },
        { status: 401 },
      );
    }

    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: session!.user.id, // Store as string
      reviewNotes: reviewNotes || "",
    };

    const updatedSpot = await TouristSpot.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate({
      path: "ownerId",
      model: "User",
      select: "name email role",
    });

    if (!updatedSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 },
      );
    }

    // Transform roles for frontend consistency and ensure status field exists
    const spotObj = updatedSpot.toObject();
    const transformedSpot = {
      ...spotObj,
      status: spotObj.status || "pending", // Default to pending if status is missing
      ownerId: updatedSpot.ownerId
        ? {
            ...updatedSpot.ownerId.toObject(),
            userRole: updatedSpot.ownerId.role,
          }
        : updatedSpot.ownerId,
      reviewedBy: spotObj.reviewedBy, // Keep as stored (string ID for now)
    };

    return NextResponse.json({
      success: true,
      data: transformedSpot,
      message: `Spot ${action}d successfully`,
    });
  } catch (error) {
    logApiError("sadmin/spots/[id] PATCH", error);
    return internalError("Error updating spot status");
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  const authResp = requireSuperAdmin(session);
  if (authResp) return authResp;

  const { id } = await params;

  // SECURITY: Validate ObjectId format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid spot ID" },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    // SECURITY: Use the same schema as admin spots for consistency
    const updateSpotSchema = z.object({
      title: z.string().min(1).max(150).optional(),
      description: z.string().min(1).max(2000).optional(),
      location: z.string().min(1).max(255).optional(),
      category: z.string().min(1).max(100).optional(),
      price: z.number().positive().optional(),
      images: z.array(z.string()).optional(),
      amenities: z.array(z.string()).optional(),
    });

    const parsed = updateSpotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid spot data" },
        { status: 400 },
      );
    }

    // SECURITY: Whitelisted update - only update allowed fields
    const updateData = parsed.data;
    const updatedSpot = await TouristSpot.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate({
      path: "ownerId",
      model: "User",
      select: "name email role",
    });

    if (!updatedSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 },
      );
    }

    // Transform role to userRole for frontend consistency
    const transformedSpot = {
      ...updatedSpot.toObject(),
      ownerId: updatedSpot.ownerId
        ? {
            ...updatedSpot.ownerId.toObject(),
            userRole: updatedSpot.ownerId.role,
          }
        : updatedSpot.ownerId,
    };

    return NextResponse.json({ success: true, data: transformedSpot });
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
  const session = await getServerSession(authOptions);

  const authResp = requireSuperAdmin(session);
  if (authResp) return authResp;

  const { id } = await params;

  // SECURITY: Validate ObjectId format first
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid spot ID" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    // Soft delete: toggle the isActive status safely
    const spot = await TouristSpot.findById(id).populate({
      path: "ownerId",
      model: "User",
      select: "name email role",
    });

    if (!spot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 },
      );
    }

    spot.isActive = !spot.isActive;
    const updatedSpot = await spot.save();

    // Transform role to userRole for frontend consistency
    const transformedSpot = {
      ...updatedSpot.toObject(),
      ownerId: updatedSpot.ownerId
        ? {
            ...updatedSpot.ownerId.toObject(),
            userRole: updatedSpot.ownerId.role,
          }
        : updatedSpot.ownerId,
    };

    return NextResponse.json({
      success: true,
      message: `Spot ${
        updatedSpot.isActive ? "enabled" : "disabled"
      } successfully`,
      data: transformedSpot,
    });
  } catch (error) {
    console.error("Error toggling spot status:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
