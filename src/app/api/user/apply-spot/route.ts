import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserApplication from "@/services/models/UserApplication";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json();

  try {
    await connectDB();

    // Check if user already applied for this spot
    const existingApplication = await UserApplication.findOne({
      userId: session.user.id,
      spotId: body.spotId
    });

    if (existingApplication) {
      return NextResponse.json({
        success: false,
        message: "You have already applied for this spot"
      });
    }

    const newApp = await UserApplication.create({
      spotId: body.spotId,
      userId: session.user.id,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: newApp });
  } catch (err) {
    console.error('Error creating application:', err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
