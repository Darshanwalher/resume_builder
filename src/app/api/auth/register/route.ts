import connectToDb from "@/app/lib/db";
import { genreateToken } from "@/app/lib/jwt";
import userModel from "@/app/models/user.model";
import { ApiResponse } from "@/app/types/api.types";
import { RegisterBody } from "@/app/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){
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

        const newUser = await userModel.create({
            name,
            email,
            password,
            mobile
        })

        const token = genreateToken({userId: newUser._id.toString()})

        const response = NextResponse.json<ApiResponse>({
            message: "User registered successfully",
            success: true,
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                }
            }
        },{status: 201})

        response.cookies.set("token",token,{
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60*60*1000
        })

        return response;

    } catch (error) {
        console.log("error in register api",error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false,
            error:{error}
        },{status: 500})
    }
}