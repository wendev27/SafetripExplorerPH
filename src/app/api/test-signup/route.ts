import { NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("🔍 SIMPLE: Received data:", json);
    
    const parsed = signupSchema.safeParse(json);
    console.log("🔍 SIMPLE: Validation result:", parsed.success);
    
    if (!parsed.success) {
      console.error("🔍 SIMPLE: Validation Error:", parsed.error.issues);
      return NextResponse.json(
        { 
          message: "Invalid signup data",
          errors: parsed.error.issues
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Validation passed - user would be created" },
      { status: 200 }
    );
  } catch (err) {
    console.error("🔍 SIMPLE: Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
