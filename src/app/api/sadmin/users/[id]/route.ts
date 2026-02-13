import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "../../../auth/[...nextauth]/route";
import User from "@/services/models/User";
import connectDB from "@/lib/db";
import { ensureRole } from "@/lib/authz";
import { logApiError, internalError } from "@/lib/api-errors";

// SECURITY: Only allow known roles when updating users.
const updateUserRoleSchema = z.object({
  userRole: z.enum(["user", "admin", "superadmin"]),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  const authResp = ensureRole(session, ["superadmin"]);
  if (authResp) return authResp;

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid user ID" },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const json = await req.json();
    const parsed = updateUserRoleSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid role data" },
        { status: 400 },
      );
    }

    const { userRole } = parsed.data;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role: userRole },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Transform role to userRole for frontend consistency
    const transformedUser = {
      ...updatedUser.toObject(),
      userRole: updatedUser.role,
    };

    return NextResponse.json({ success: true, data: transformedUser });
  } catch (error) {
    logApiError("sadmin/users/[id] PUT", error);
    return internalError();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  const authResp = ensureRole(session, ["superadmin"]);
  if (authResp) return authResp;

  const { id } = await params;

  try {
    await connectDB();

    // Prevent super admin from deleting themselves
    if (id === session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 },
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logApiError("sadmin/users/[id] DELETE", error);
    return internalError();
  }
}
