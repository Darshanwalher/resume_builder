import connectToDb from "@/lib/mongodb";
import { genreateToken } from "@/lib/jwt";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDb();

        const body: LoginBody = await req.json();

        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json<ApiResponse>({
                message: "All fields are required",
                success: false
            }, { status: 400 })
        }

        const isExisted = await userModel.findOne({ email });

        if (!isExisted) {
            return NextResponse.json<ApiResponse>({
                message: "User not found",
                success: false
            }, { status: 404 })
        }

        const isMatch = isExisted.comparePass(password);

        if (!isMatch) {
            return NextResponse.json<ApiResponse>({
                message: "Invalid credentials",
                success: false
            }, { status: 401 })
        }

        const token = genreateToken({ userId: isExisted._id.toString() })

        const response = NextResponse.json<ApiResponse>({
            message: "User logged in successfully",
            success: true,
            data: {
                user: {
                    _id: isExisted._id,
                    name: isExisted.name,
                    email: isExisted.email,
                }
            }
        }, { status: 201 })

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        })

        return response;

    } catch (error) {
        console.log("error in register api", error);
        return NextResponse.json<ApiResponse>({
            message: "Something went wrong",
            success: false,
            error: { error }
        }, { status: 500 })
    }
}