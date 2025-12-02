// src/app/api/admin/spots/route.ts

import { NextResponse } from "next/server";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const newSpot = await TouristSpot.create({
      title: body.title,
      description: body.description,
      location: body.location,
      category: body.category,
      price: body.price,
      images: body.images || [],
      amenities: body.amenities || [],
    });

    return NextResponse.json({ success: true, data: newSpot });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Error" },
      { status: 500 }
    );
  }
}
