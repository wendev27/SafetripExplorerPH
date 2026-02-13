import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import { ensureRole } from "@/lib/authz";
import { logApiError, internalError } from "@/lib/api-errors";

// SECURITY: Only allow valid booking status transitions.
const bookingStatusSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "completed"]),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  const authResp = ensureRole(session, ["admin"]);
  if (authResp) return authResp;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid booking ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const json = await req.json();
    const parsed = bookingStatusSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid booking status" },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    // First, verify that this booking belongs to a spot owned by this admin
    const booking = await UserApplication.findById(id).populate("spotId");

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the admin owns the spot
    if (booking.spotId.ownerId.toString() !== session!.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to manage this booking" },
        { status: 403 }
      );
    }

    // Update the booking status
    const updatedBooking = await UserApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate({
        path: "userId",
        model: "User",
        select: "name email",
      })
      .populate({
        path: "spotId",
        model: "TouristSpot",
        select: "title location price",
      });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    logApiError("admin/bookings/[id]", error);
    return internalError();
  }
}

