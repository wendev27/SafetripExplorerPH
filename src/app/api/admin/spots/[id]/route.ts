import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    // Find the spot and check if it belongs to the admin
    const spot = await TouristSpot.findOne({
      _id: id,
      ownerId: session.user.id
    });

    if (!spot) {
      return NextResponse.json(
        { success: false, message: "Spot not found or access denied" },
        { status: 404 }
      );
    }

    // Delete the spot
    await TouristSpot.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Spot deleted successfully" });
  } catch (error) {
    console.error('Error deleting spot:', error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
