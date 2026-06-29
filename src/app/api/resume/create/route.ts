import connectToDb from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import resumeModel from "@/app/models/resume.model";
import { ApiResponse } from "@/app/types/api.types";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req: NextRequest) {
    try {
        await connectToDb();
        
        const userId = await getCurrentUser();

        const newResume = await resumeModel.create({
            userId: userId,
            title: "",
            summary: "",
            personalInfo: {},
            education: [],
            workExperience: [],
            projects: [],
            skills: [],
            certifications: []
        })

        return NextResponse.json<ApiResponse>({
            success: true,
            message: "Resume created successfully",
            data: newResume
        },{status: 201});
        
    } catch (error) {
        console.log("error in create api ",error);

        return NextResponse.json<ApiResponse>({
            success: false,
            message: "Something went wrong",
            data: {error}
        },{status: 500});

    }
}