import connectToDb from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";
import resumeModel from "@/models/resume.model";
import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDb();
    
    // getCurrentUser will throw if unauthorized
    const userId = await getCurrentUser();
    
    const resumes = await resumeModel.find({ userId }).sort({ updatedAt: -1 });
    
    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes,
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error in get resumes API:", error);
    return NextResponse.json<ApiResponse>({
      success: false,
      message: error.message || "Failed to fetch resumes",
      data: { error },
    }, { status: 500 });
  }
}
