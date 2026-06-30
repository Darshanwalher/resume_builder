import api from "@/services/axios";
import { LoginBody, RegisterBody } from "@/types/user.types";

export const loginUser = async (credentials: LoginBody) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const registerUser = async (userData: RegisterBody) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
