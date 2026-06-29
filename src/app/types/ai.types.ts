export interface GenerateSummary {
    experienceLevel: string;
    skills: string[];
    jobTitle: string;
}

export interface GenerateSkills {
    experienceLevel: string;
    jobTitle: string;
}

export interface GenerateProjectDescriptionBody {
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
}

export interface GenerateExperienceDescriptionBody {
  experienceLevel: string;
  techStack: string[];
  yearsOfExperience: number;
  jobRole: string;
}