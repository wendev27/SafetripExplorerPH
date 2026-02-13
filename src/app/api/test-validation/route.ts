import { NextResponse } from "next/server";
import { z } from "zod";

// Simple test schema
const testSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("🔍 TEST: Received data:", json);
    
    const parsed = testSchema.safeParse(json);
    console.log("🔍 TEST: Validation result:", parsed.success);
    
    if (!parsed.success) {
      console.error("🔍 TEST: Validation Error:", parsed.error.issues);
      return NextResponse.json(
        { 
          message: "Invalid email",
          errors: parsed.error.issues
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Email is valid" },
      { status: 200 }
    );
  } catch (err) {
    console.error("🔍 TEST: Error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
