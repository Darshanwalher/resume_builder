import connectToDb from "@/app/lib/db";
import userModel from "@/app/models/user.model";
import { ApiResponse } from "@/app/types/api.types";
import { RegisterBody } from "@/app/types/user.types";
import { NextRequest, NextResponse } from "next/server";

async function POST (req: NextRequest){
    try {
        await connectToDb();
        const body:RegisterBody = await req.json();
        const {name,email,password,mobile} = body;

        if(!name || !email || !password){
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                success: false
            },{status: 400})
        }

        const isExisted = await userModel.findOne({email});

        if(isExisted){
            return NextResponse.json<ApiResponse>({
                message: "User already exists",
                success: false
            },{status: 409})
        }

        const user = await userModel.create({
            name,
            email,
            password,
            mobile
        })



    } catch (error) {
        console.log("error in register api",error);
        
    }
}