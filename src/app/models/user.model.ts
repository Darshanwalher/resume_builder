import mongoose, { Document } from "mongoose";
import { Iuser } from "../types/user.types.js";
import bcrypt from "bcrypt";



interface UserDocument extends Omit <Iuser,"_id">, Document {
  comparePass(candidatePassword: string): boolean;
}


const userSchema = new mongoose.Schema<UserDocument>({
    name:{
        type: String,
        trim: true,
        required: [true,"Name is required"]
    },
    email:{
        type: String,
        trim: true,
        unique: true,
        required: [true,"Email is required"]
    },
    password:{
        type: String,
        required: [true,"Password is required"],
        minlength: [6,"Password must be at least 6 characters"]
    },
    mobile: {
        type: String,
        minlength: [10,"minmum 10 characters required"],
        maxlength: [10,"maximum 10 characters required"]
    }

},{timestamps: true})

userSchema.pre("save",function(): void{
    if(!this.isModified("password")) return; 
    this.password = bcrypt.hashSync(this.password,10);
})

userSchema.methods.comparePass = function (candidatePassword: string): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const userModel = mongoose.models.user || mongoose.model("user", userSchema);


export default userModel;