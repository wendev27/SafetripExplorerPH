import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  try {
    await connectDB();

    // Get user's applications with populated spot details
    const applications = await UserApplication.find({
      userId: session.user.id
    })
      .populate({
        path: 'spotId',
        model: 'TouristSpot',
        select: 'title description location category price images amenities'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}