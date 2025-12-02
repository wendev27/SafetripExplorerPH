import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TouristSpot from "@/services/models/TouristSpot";

export async function GET() {
  try {
    await connectDB();
    const spots = await TouristSpot.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: spots });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
