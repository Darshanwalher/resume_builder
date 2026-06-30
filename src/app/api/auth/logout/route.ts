import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json<ApiResponse>({
      success: true,
      message: "Logged out successfully",
    }, { status: 200 });

    response.cookies.set("token", "", {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(0),
      path: "/"
    });

    return response;
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: "Something went wrong",
    }, { status: 500 });
  }
}
