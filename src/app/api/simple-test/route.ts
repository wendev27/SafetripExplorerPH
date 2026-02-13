import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    console.log("🔍 SIMPLE TEST: Received:", json);
    
    return NextResponse.json(
      { 
        message: "Request received successfully",
        received_data: json
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (err) {
    console.error("🔍 SIMPLE TEST: Error:", err);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
