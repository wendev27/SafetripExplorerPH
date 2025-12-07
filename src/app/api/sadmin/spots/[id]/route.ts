import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

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

    const deletedSpot = await TouristSpot.findByIdAndDelete(id);

    if (!deletedSpot) {
      return NextResponse.json(
        { success: false, message: "Spot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Spot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting spot:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
