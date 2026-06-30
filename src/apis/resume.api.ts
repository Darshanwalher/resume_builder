import api from "@/services/axios";

export const createResume = async () => {
  const res = await api.post("/resume/create");
  return res.data;
};

export const getResume = async (resumeId: string) => {
  const res = await api.get(`/resume/${resumeId}`);
  return res.data;
};

export const updateResume = async (resumeId: string, resumeData: any) => {
  const res = await api.patch(`/resume/${resumeId}`, resumeData);
  return res.data;
};

export const getResumes = async () => {
  const res = await api.get("/resume");
  return res.data;
};

export const deleteResume = async (resumeId: string) => {
  const res = await api.delete(`/resume/${resumeId}`);
  return res.data;
};
