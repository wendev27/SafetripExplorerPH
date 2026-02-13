import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User from "@/services/models/User";
import connectDB from "@/lib/db";

// SECURITY: Server-side schema validation for signup requests.
const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8).max(128),
});

// SECURITY: Configure bcrypt salt rounds via env with a safe default.
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? "12");

export async function POST(req: Request) {
  // SECURITY: Add CORS headers for Postman compatibility
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    await connectDB();

    const json = await req.json();
    console.log(" DEBUG: Received request data:", json);

    const parsed = signupSchema.safeParse(json);
    console.log(" DEBUG: Validation result:", parsed.success);

    if (!parsed.success) {
      console.error(" Validation Error:", parsed.error.issues);
      return NextResponse.json(
        {
          message: "Invalid signup data",
          errors: parsed.error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400, headers },
      );
    }

    const { name, email, password } = parsed.data;

    // Check if user exists (generic message to avoid enumeration)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Unable to create account" },
        { status: 400, headers },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create new user with proper error handling
    try {
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });

      console.log(" User successfully created in database:", email);
      return NextResponse.json(
        { message: "User created successfully" },
        { status: 201, headers },
      );
    } catch (dbError: any) {
      console.error(" Database creation error:", dbError);
      return NextResponse.json(
        { message: "Failed to create user in database" },
        { status: 500, headers },
      );
    }
  } catch (err: any) {
    console.error(" Critical signup error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500, headers },
    );
  }
}

// SECURITY: Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
