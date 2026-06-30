import connectToDb from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDb();
    
    // getCurrentUser throws an error if token is missing or invalid
    const userId = await getCurrentUser();
    
    const user = await userModel.findById(userId).select("-password");
    
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User profile fetched successfully",
      data: { user }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error in auth/me API:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: error.message || "Unauthorized user",
      data: { error }
    }, { status: 401 });
  }
}
