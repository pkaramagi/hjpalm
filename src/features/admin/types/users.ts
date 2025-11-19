export type AdminUserRole = "admin" | "manager" | "staff" | "viewer";

export type AdminUserStatus = "active" | "invited" | "suspended";

export interface AdminUserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  phone?: string;
  location?: string;
  createdAt: string;
  lastSignInAt: string | null;
}

export interface CreateAdminUserInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: AdminUserRole;
  phone?: string;
  location?: string;
}

export interface BulkCreateAdminUserInput {
  fullName: string;
  email: string;
  department: string;
  role: AdminUserRole;
  phone?: string;
  location?: string;
}

export interface BulkCreateAdminUsersResult {
  created: AdminUserRecord[];
  skipped: Array<{ email: string; reason: string }>;
}

export interface PasswordResetResult {
  userId: string;
  temporaryPassword: string;
  expiresAt: string;
}

export type AdminUserFilters = {
  query?: string;
  role?: AdminUserRole | "all";
  status?: AdminUserStatus | "all";
};
