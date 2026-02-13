import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";

import UserApplication from "@/services/models/UserApplication";
import User from "@/services/models/User";

// SECURITY: Shared schema for user applications.
const sharedApplicationSchema = z.object({
  spotId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user)
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );

  const json = await req.json();

  const parsed = sharedApplicationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid application data" },
      { status: 400 }
    );
  }

  const { spotId } = parsed.data;

  // SECURITY: Ensure we only accept valid MongoDB ObjectIds.
  if (!mongoose.Types.ObjectId.isValid(spotId)) {
    return NextResponse.json(
      { success: false, message: "Invalid spot ID" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const newApp = await UserApplication.create({
      spotId,
      userId: session.user.id,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: newApp });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
