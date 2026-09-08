export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MP: "MP",
  DISTRICT_AUTHORITY: "DISTRICT_AUTHORITY",
  AUDITOR: "AUDITOR",
  CONTRACTOR: "CONTRACTOR",
  CITIZEN: "CITIZEN"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const USER_ROLES = Object.values(UserRole);

export const UserStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED"
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ProjectStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  IN_PROGRESS: "IN_PROGRESS",
  DELAYED: "DELAYED",
  COMPLETED: "COMPLETED",
  AUDIT_PENDING: "AUDIT_PENDING",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED"
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const AiStatus = {
  NOT_STARTED: "NOT_STARTED",
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED"
} as const;

export type AiStatus = (typeof AiStatus)[keyof typeof AiStatus];

export const AuditStatus = {
  NOT_STARTED: "NOT_STARTED",
  ASSIGNED: "ASSIGNED",
  IN_REVIEW: "IN_REVIEW",
  AI_GENERATED: "AI_GENERATED",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED"
} as const;

export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus];

export const PaymentStatus = {
  INITIATED: "INITIATED",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  FLAGGED: "FLAGGED",
  REVERSED: "REVERSED"
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStage = {
  ADVANCE: "ADVANCE",
  MILESTONE: "MILESTONE",
  FINAL: "FINAL",
  RETENTION: "RETENTION"
} as const;

export type PaymentStage = (typeof PaymentStage)[keyof typeof PaymentStage];

export const ComplaintStatus = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  MATCHED: "MATCHED",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED"
} as const;

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

export const NotificationChannel = {
  IN_APP: "IN_APP",
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH"
} as const;

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];

export const RiskLevel = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const;

export type RiskLevel = (typeof RiskLevel)[keyof typeof RiskLevel];

export const QueueName = {
  IMAGE_PROCESSING: "image-processing",
  AI_PREDICTION: "ai-prediction",
  PDF_GENERATION: "pdf-generation",
  EMAIL: "email-notification",
  RISK_RECALCULATION: "risk-recalculation",
  DAILY_ANALYTICS: "daily-analytics"
} as const;

export const SocketEvent = {
  PROJECT_UPDATED: "projectUpdated",
  RISK_DETECTED: "riskDetected",
  AUDIT_COMPLETED: "auditCompleted",
  COMPLAINT_CREATED: "complaintCreated",
  NOTIFICATION_CREATED: "notificationCreated",
  PAYMENT_STATUS_UPDATED: "paymentStatusUpdated"
} as const;

export const MediaFolder = {
  PROJECTS: "projects",
  USERS: "users",
  COMPLAINTS: "complaints",
  AUDIT: "audit"
} as const;
