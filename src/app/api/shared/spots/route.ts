import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TouristSpot from "@/services/models/TouristSpot";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Check if there's an ID in the query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Handle individual spot request
      const spot = await TouristSpot.findOne({ _id: id, status: "approved" });
      if (!spot) {
        return NextResponse.json(
          { success: false, message: "Spot not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: spot });
    }

    // Handle all spots request - only show approved spots
    const spots = await TouristSpot.find({ status: "approved" }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
