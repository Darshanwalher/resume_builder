import { Types } from "mongoose";

export interface IPersonalInfo {
    fullName: string;
    email: string;
    mobile: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
}

export interface IWorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface IProject {
    title: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techStack: string[];
}

export interface IEducation {
    institute: string;
    degree: string;
    startDate: string;
    endDate: string;
}

export interface IResume {
    _id?: string;
    userId: Types.ObjectId;
    title: string;
    summary: string;
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    skills: string[];
    projects: IProject[];
    education: IEducation[];
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;

}