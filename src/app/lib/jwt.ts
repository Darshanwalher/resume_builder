import jwt from "jsonwebtoken";
import { JWTpayload } from "../types/user.types";

export const genreateToken = (payload: JWTpayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h"
    })
}

export const verifyToken = (token: string):any  => {
    return jwt.verify(token, process.env.JWT_SECRET!)
}