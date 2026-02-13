import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/services/models/User";
import connectDB from "@/lib/db";
import { requireSuperAdmin } from "@/lib/authz";

export async function GET() {
  const session = await getServerSession(authOptions);

  const authResp = requireSuperAdmin(session);
  if (authResp) return authResp;

  try {
    await connectDB();

    const users = await User.find({})
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 });

    // Transform role to userRole for frontend consistency
    const transformedUsers = users.map((user) => ({
      ...user.toObject(),
      userRole: user.role,
    }));

    return NextResponse.json({ success: true, data: transformedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
