import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "superadmin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  console.log("Spot ID to update:", id);

  try {
    await connectDB();
    const body = await req.json();
    const { action, reviewNotes } = body;

    console.log("Approval request body:", body);
    console.log("Session user ID:", session.user?.id);

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid action. Must be 'approve' or 'reject'",
        },
        { status: 400 }
      );
    }

    if (!session.user?.id) {
      return NextResponse.json(
        { success: false, message: "User session invalid" },
        { status: 401 }
      );
    }

    // Validate the spot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid spot ID" },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: session.user.id, // Store as string
      reviewNotes: reviewNotes || "",
    };

    console.log("Update data:", updateData);

    const updatedSpot = await TouristSpot.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate({
      path: "ownerId",
      model: "User",
      select: "name email role",
    });

    console.log("Updated spot result:", updatedSpot ? "found" : "not found");

    if (!updatedSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 }
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
    console.error("Error updating spot status:", error);
    console.error("Session user:", session.user);
    console.error("Session user ID:", session.user?.id);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "superadmin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();

    const updatedSpot = await TouristSpot.findByIdAndUpdate(
      id,
      {
        title: body.title,
        description: body.description,
        location: body.location,
        category: body.category,
        price: body.price,
        images: body.images,
        amenities: body.amenities,
      },
      { new: true }
    ).populate({
      path: "ownerId",
      model: "User",
      select: "name email role",
    });

    if (!updatedSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 }
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
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "superadmin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

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
        { status: 404 }
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
      { status: 500 }
    );
  }
}
