import mongoose from "mongoose";
import { IResume } from "../types/resume.types";

const resumeSchema = new mongoose.Schema<IResume>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        default: "",
    },
    summary: {
        type: String,
        default: "",
    },
    personalInfo: {
        type: {
            fullName: String,
            email: String,
            mobile: String,
            location: String,
            github: String,
            linkedin: String,
            portfolio: String
        },
        default: {}
    },
    education: {
        type: [
            {
                institute: String,
                degree: String,
                startDate: String,
                endDate: String
            }
        ],
        default: []
    },
    workExperience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                description: String
            }
        ],
        default: []
    },
    projects: {
        type: [
            {
                title: String,
                description: String,
                githubUrl: String,
                liveUrl: String,
                techStack: [String]
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    certifications: {
        type: [String],
        default: []
    }

},{timestamps: true});

const resumeModel = mongoose.model('resume',resumeSchema)

export default resumeModel;