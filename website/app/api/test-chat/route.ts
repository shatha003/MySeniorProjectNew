import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "OPENROUTER_API_KEY is not configured. Please add it in Vercel dashboard settings.",
      configured: false
    });
  }
  
  // Test if API key works with a minimal request
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    
    if (response.ok) {
      return NextResponse.json({
        status: "success",
        message: "API key is configured and working",
        configured: true
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({
        status: "error",
        message: `API key is configured but returned error: ${response.status} - ${errorText}`,
        configured: true,
        errorCode: response.status
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: `API key configuration error: ${error.message}`,
      configured: false
    });
  }
}