export type UserRole = "ADMIN" | "AGENT" | "USER";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}