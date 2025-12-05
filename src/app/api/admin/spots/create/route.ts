// src/app/api/admin/spots/create/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.userRole !== "admin") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

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
      ownerId: session.user.id, // Set the owner
    });

    return NextResponse.json({ success: true, data: newSpot });
  } catch (err) {
    console.error('Error creating spot:', err);
    return NextResponse.json(
      { success: false, message: "Error creating spot" },
      { status: 500 }
    );
  }
}
