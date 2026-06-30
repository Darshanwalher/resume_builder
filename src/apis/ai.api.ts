import api from "@/services/axios";
import {
  GenerateSummary,
  GenerateSkills,
  GenerateProjectDescriptionBody,
  GenerateExperienceDescriptionBody,
} from "@/types/ai.types";

export const getAtsScore = async (resumeText: string) => {
  const res = await api.post("/ai/ats-score", { resumeText });
  return res.data;
};

export const generateExperienceDescription = async (
  body: GenerateExperienceDescriptionBody
) => {
  const res = await api.post("/ai/generate-experience-description", body);
  return res.data;
};

export const generateProjectDescription = async (
  body: GenerateProjectDescriptionBody
) => {
  const res = await api.post("/ai/generate-project-description", body);
  return res.data;
};

export const generateSkills = async (body: GenerateSkills) => {
  const res = await api.post("/ai/generate-skills", body);
  return res.data;
};

export const generateSummary = async (body: GenerateSummary) => {
  const res = await api.post("/ai/generate-summary", body);
  return res.data;
};

export const improveContent = async (content: string) => {
  const res = await api.post("/ai/improve-content", { content });
  return res.data;
};
