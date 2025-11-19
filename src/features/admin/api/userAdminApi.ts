import type {
  AdminUserRecord,
  AdminUserRole,
  BulkCreateAdminUserInput,
  BulkCreateAdminUsersResult,
  CreateAdminUserInput,
  PasswordResetResult,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const now = () => new Date().toISOString();
const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `usr-${Math.random().toString(36).slice(2, 10)}`;

const randomPassword = (length = 12) => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%";
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
};

const createRecord = (input: {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: AdminUserRole;
  status?: AdminUserRecord["status"];
  phone?: string;
  location?: string;
  createdAt?: string;
  lastSignInAt?: string | null;
}): AdminUserRecord => ({
  id: input.id ?? randomId(),
  firstName: input.firstName.trim(),
  lastName: input.lastName.trim(),
  email: input.email.trim().toLowerCase(),
  department: input.department.trim(),
  role: input.role,
  status: input.status ?? "active",
  phone: input.phone,
  location: input.location,
  createdAt: input.createdAt ?? now(),
  lastSignInAt: input.lastSignInAt ?? null,
});

const seedUsers: AdminUserRecord[] = [
  createRecord({
    id: "usr-admin-001",
    firstName: "Grace",
    lastName: "Jang",
    email: "grace.jang@example.com",
    department: "Administration",
    role: "admin",
    phone: "+82 10-1020-3040",
    location: "Seoul HQ",
    status: "active",
    lastSignInAt: "2025-11-10T08:12:00.000Z",
    createdAt: "2024-01-05T10:00:00.000Z",
  }),
  createRecord({
    id: "usr-admin-002",
    firstName: "Noah",
    lastName: "Park",
    email: "noah.park@example.com",
    department: "Education",
    role: "manager",
    phone: "+82 10-8080-6060",
    location: "Busan Campus",
    status: "active",
    lastSignInAt: "2025-11-11T10:41:00.000Z",
    createdAt: "2024-03-15T08:03:00.000Z",
  }),
  createRecord({
    id: "usr-admin-003",
    firstName: "Hannah",
    lastName: "Seo",
    email: "hannah.seo@example.com",
    department: "Training",
    role: "manager",
    phone: "+82 10-4545-4545",
    location: "Cheongpyeong",
    status: "invited",
    lastSignInAt: null,
    createdAt: "2025-10-20T09:45:00.000Z",
  }),
  createRecord({
    id: "usr-admin-004",
    firstName: "Eli",
    lastName: "Choi",
    email: "eli.choi@example.com",
    department: "HR",
    role: "staff",
    phone: "+82 10-3232-2323",
    location: "Seoul HQ",
    status: "suspended",
    lastSignInAt: "2025-08-14T05:31:00.000Z",
    createdAt: "2023-11-22T03:15:00.000Z",
  }),
  createRecord({
    id: "usr-admin-005",
    firstName: "Joy",
    lastName: "Lim",
    email: "joy.lim@example.com",
    department: "Communications",
    role: "staff",
    phone: "+82 10-5454-7878",
    location: "Incheon",
    status: "active",
    lastSignInAt: "2025-11-12T02:58:00.000Z",
    createdAt: "2024-07-11T07:17:00.000Z",
  }),
  createRecord({
    id: "usr-admin-006",
    firstName: "Caleb",
    lastName: "Han",
    email: "caleb.han@example.com",
    department: "Logistics",
    role: "viewer",
    phone: "+82 10-9090-7070",
    location: "Seoul HQ",
    status: "active",
    lastSignInAt: "2025-11-09T11:01:00.000Z",
    createdAt: "2022-05-02T12:01:00.000Z",
  }),
];

const userStore: Record<string, AdminUserRecord> = seedUsers.reduce(
  (acc, user) => ({ ...acc, [user.id]: user }),
  {} as Record<string, AdminUserRecord>,
);

const findByEmail = (email: string) =>
  Object.values(userStore).find((user) => user.email.toLowerCase() === email.toLowerCase());

export async function listAdminUsers(): Promise<AdminUserRecord[]> {
  await delay(250);
  return Object.values(userStore)
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
    .map((user) => clone(user));
}

export async function createAdminUser(payload: CreateAdminUserInput): Promise<AdminUserRecord> {
  await delay(350);
  if (findByEmail(payload.email)) {
    throw new Error("A user with that email already exists.");
  }

  const record = createRecord({
    ...payload,
    status: "invited",
    lastSignInAt: null,
  });

  userStore[record.id] = record;
  return clone(record);
}

export async function resetAdminUserPassword(userId: string): Promise<PasswordResetResult> {
  await delay(300);
  const target = userStore[userId];
  if (!target) {
    throw new Error("User not found.");
  }

  target.status = target.status === "suspended" ? "invited" : target.status;

  return {
    userId,
    temporaryPassword: randomPassword(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };
}

export async function bulkCreateAdminUsers(
  batch: BulkCreateAdminUserInput[],
): Promise<BulkCreateAdminUsersResult> {
  await delay(600);
  const result: BulkCreateAdminUsersResult = {
    created: [],
    skipped: [],
  };

  batch.forEach((entry) => {
    const email = entry.email.trim().toLowerCase();
    if (!email) {
      result.skipped.push({ email: entry.email, reason: "Missing email" });
      return;
    }

    if (findByEmail(email)) {
      result.skipped.push({ email, reason: "Duplicate email" });
      return;
    }

    const [firstName, ...lastParts] = entry.fullName.trim().split(" ");
    const lastName = lastParts.join(" ") || "Team";

    const record = createRecord({
      firstName: firstName || "New",
      lastName,
      email,
      department: entry.department || "General",
      role: entry.role,
      phone: entry.phone,
      location: entry.location,
      status: "invited",
    });

    userStore[record.id] = record;
    result.created.push(clone(record));
  });

  return result;
}
