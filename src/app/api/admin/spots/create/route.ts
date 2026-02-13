// src/app/api/admin/spots/create/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TouristSpot from "@/services/models/TouristSpot";
import connectDB from "@/lib/db";
import { ensureRole } from "@/lib/authz";
import { logApiError, internalError } from "@/lib/api-errors";

// SECURITY: Validate all fields for new spots created by admins.
const adminSpotSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(2000),
  location: z.string().min(1).max(255),
  category: z.string().min(1).max(100),
  price: z.number().positive(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const authResp = ensureRole(session, ["admin"]);
  if (authResp) return authResp;

  try {
    await connectDB();
    const json = await req.json();
    const parsed = adminSpotSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid spot data" },
        { status: 400 }
      );
    }

    const { title, description, location, category, price, images, amenities } =
      parsed.data;

    const newSpot = await TouristSpot.create({
      title,
      description,
      location,
      category,
      price,
      images: images ?? [],
      amenities: amenities ?? [],
      ownerId: session!.user.id, // Set the owner
      status: "pending", // Set status to pending for approval workflow
    });

    return NextResponse.json({ success: true, data: newSpot });
  } catch (err) {
    logApiError("admin/spots/create", err);
    return internalError("Error creating spot");
  }
}

