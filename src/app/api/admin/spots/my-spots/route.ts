import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import { requireAdmin } from "@/lib/authz";

export async function GET() {
  const session = await getServerSession(authOptions);

  const authResp = requireAdmin(session);
  if (authResp) return authResp;

  try {
    await connectDB();

    const spots = await TouristSpot.find({
      ownerId: session!.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    console.error("Error fetching admin spots:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
