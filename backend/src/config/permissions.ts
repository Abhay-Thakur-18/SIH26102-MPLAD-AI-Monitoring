import { UserRole } from "./constants";

export const Permission = {
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_VERIFY: "users.verify",
  USERS_IMPORT: "users.import",
  PROJECTS_CREATE: "projects.create",
  PROJECTS_READ: "projects.read",
  PROJECTS_READ_OWN: "projects.read_own",
  PROJECTS_UPDATE: "projects.update",
  PROJECTS_DELETE: "projects.delete",
  PROJECTS_ASSIGN: "projects.assign",
  PROJECTS_EXPORT: "projects.export",
  MILESTONES_UPDATE: "milestones.update",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_READ: "payments.read",
  PAYMENTS_UPDATE: "payments.update",
  AUDIT_GENERATE: "audit.generate",
  AUDIT_READ: "audit.read",
  AUDIT_ASSIGN: "audit.assign",
  COMPLAINTS_CREATE: "complaints.create",
  COMPLAINTS_READ: "complaints.read",
  COMPLAINTS_UPDATE: "complaints.update",
  AI_INVOKE: "ai.invoke",
  DASHBOARD_READ: "dashboard.read",
  NOTIFICATIONS_READ: "notifications.read",
  CONTRACTORS_READ: "contractors.read",
  CONTRACTORS_UPDATE: "contractors.update"
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

const ALL_PERMISSIONS = Object.values(Permission);

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: ALL_PERMISSIONS,
  [UserRole.ADMIN]: [
    Permission.USERS_CREATE,
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.USERS_DELETE,
    Permission.USERS_VERIFY,
    Permission.USERS_IMPORT,
    Permission.PROJECTS_READ,
    Permission.CONTRACTORS_READ,
    Permission.CONTRACTORS_UPDATE,
    Permission.DASHBOARD_READ,
    Permission.NOTIFICATIONS_READ,
    Permission.COMPLAINTS_READ
  ],
  [UserRole.MP]: [
    Permission.PROJECTS_READ_OWN,
    Permission.PAYMENTS_READ,
    Permission.AUDIT_READ,
    Permission.DASHBOARD_READ,
    Permission.NOTIFICATIONS_READ,
    Permission.COMPLAINTS_READ
  ],
  [UserRole.DISTRICT_AUTHORITY]: [
    Permission.PROJECTS_CREATE,
    Permission.PROJECTS_READ,
    Permission.PROJECTS_UPDATE,
    Permission.PROJECTS_ASSIGN,
    Permission.PROJECTS_EXPORT,
    Permission.MILESTONES_UPDATE,
    Permission.PAYMENTS_CREATE,
    Permission.PAYMENTS_READ,
    Permission.PAYMENTS_UPDATE,
    Permission.CONTRACTORS_READ,
    Permission.COMPLAINTS_READ,
    Permission.COMPLAINTS_UPDATE,
    Permission.DASHBOARD_READ,
    Permission.NOTIFICATIONS_READ,
    Permission.AI_INVOKE
  ],
  [UserRole.AUDITOR]: [
    Permission.PROJECTS_READ,
    Permission.PAYMENTS_READ,
    Permission.AUDIT_GENERATE,
    Permission.AUDIT_READ,
    Permission.AUDIT_ASSIGN,
    Permission.AI_INVOKE,
    Permission.DASHBOARD_READ,
    Permission.NOTIFICATIONS_READ
  ],
  [UserRole.CONTRACTOR]: [
    Permission.PROJECTS_READ_OWN,
    Permission.MILESTONES_UPDATE,
    Permission.NOTIFICATIONS_READ
  ],
  [UserRole.CITIZEN]: [
    Permission.PROJECTS_READ,
    Permission.COMPLAINTS_CREATE,
    Permission.NOTIFICATIONS_READ
  ]
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};
