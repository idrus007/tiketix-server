// src/types/UserPayload.ts
export interface UserPayload {
  id: number;
  email: string;
  password: string;
  role: "admin" | "user";
}
