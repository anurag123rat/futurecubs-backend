export const ROLES = {
  SUPER_ADMIN: "superadmin",
  ADMIN: "admin",
  TEACHER: "teacher",
  PARENT: "parent",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];