import connectToDb from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import resumeModel from "@/app/models/resume.model";
import { ApiResponse } from "@/app/types/api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, {params} : {params: Promise<{resumeId: string}>}){
    try {
        
        await connectToDb();

        const user = await getCurrentUser()

        const {resumeId} = await params;

        const resume = await resumeModel.findOne({
            _id: resumeId,
            userId: user.userId
        });

        if(!resume){
            return NextResponse.json<ApiResponse>({
                success: false,
                message: "resume nor found",
            },{status: 404});
        }

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume fetched successfully",
            data: resume
        },{status: 200});
    } catch (error) {

        console.log("error in get resume api ",error);

        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong",
            data: {error}
        },{status: 500});
    }

}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  try {
    await connectToDb();

    const user = await getCurrentUser();

    const body = await req.json();

    const { resumeId } = await params;

    const updatedResume = await resumeModel.findOneAndUpdate(
      {
        _id: resumeId,
        userId: user.userId,
      },
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedResume) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "updated resume failed to update",
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Resume updated successfully",
        data: updatedResume,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in update resume API:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Something went wrong",
        data: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}