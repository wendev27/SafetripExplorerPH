import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserApplication from "@/services/models/UserApplication";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

    const newApp = await UserApplication.create({
      spotId: body.spotId,
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
