import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await connectDB();
    const body = await req.json();

    // First, verify that this booking belongs to a spot owned by this admin
    const booking = await UserApplication.findById(id).populate('spotId');

    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if the admin owns the spot
    if (booking.spotId.ownerId.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to manage this booking" },
        { status: 403 }
      );
    }

    // Update the booking status
    const updatedBooking = await UserApplication.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).populate({
      path: 'userId',
      model: 'User',
      select: 'name email'
    }).populate({
      path: 'spotId',
      model: 'TouristSpot',
      select: 'title location price'
    });

    return NextResponse.json({ success: true, data: updatedBooking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
