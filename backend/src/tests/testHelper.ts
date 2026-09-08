import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { ProjectModel } from "../models/project.model";
import { ContractorModel } from "../models/contractor.model";
import { PaymentModel } from "../models/payment.model";
import { AuditReportModel } from "../models/auditReport.model";
import { NotificationModel } from "../models/notification.model";
import { AiResultModel } from "../models/aiResult.model";
import { ActivityLogModel } from "../models/activityLog.model";
import { userRepository } from "../repositories/user.repository";
import { projectRepository } from "../repositories/project.repository";
import { contractorRepository } from "../repositories/contractor.repository";
import { paymentRepository } from "../repositories/payment.repository";
import { auditRepository } from "../repositories/audit.repository";
import { notificationRepository } from "../repositories/notification.repository";
import { aiResultRepository } from "../repositories/aiResult.repository";
import { activityLogRepository } from "../repositories/activity.repository";
import { UserRole, UserStatus } from "../config/constants";
import { signAccessToken, signRefreshToken } from "../utils/tokens";
import { sessionService } from "../services/session.service";

// In-Memory Document Stores
const users = new Map<string, any>();
const projects = new Map<string, any>();
const contractors = new Map<string, any>();
const payments = new Map<string, any>();
const auditReports = new Map<string, any>();
const notifications = new Map<string, any>();
const aiResults = new Map<string, any>();

const createDoc = (map: Map<string, any>, data: any) => {
  const _id = data._id ? String(data._id) : new mongoose.Types.ObjectId().toHexString();
  const id = _id;
  const doc: any = {
    ...data,
    _id,
    id,
    createdAt: data.createdAt || new Date(),
    updatedAt: new Date(),
    isDeleted: data.isDeleted ?? false
  };

  doc.save = jest.fn(async function () {
    this.updatedAt = new Date();
    map.set(this.id, this);
    return this;
  });

  doc.toObject = jest.fn(function () {
    const copy = { ...this };
    delete copy.save;
    delete copy.toObject;
    return copy;
  });

  map.set(id, doc);
  return doc;
};

export const setupTestDb = async (): Promise<void> => {
  // Mock Mongoose connection
  (mongoose as any).connect = jest.fn().mockResolvedValue(mongoose);
  (mongoose as any).disconnect = jest.fn().mockResolvedValue(undefined);

  // Wire UserRepository
  Object.assign(userRepository, {
    create: jest.fn(async (data: any) => createDoc(users, data)),
    findById: jest.fn((id: string) => {
      const u = users.get(String(id)) || null;
      const p = Promise.resolve(u) as any;
      p.select = () => Promise.resolve(u);
      return p;
    }),
    findByEmail: jest.fn((email: string) => {
      let found: any = null;
      for (const u of users.values()) {
        if (u.email?.toLowerCase() === email.toLowerCase() && !u.isDeleted) {
          found = u;
          break;
        }
      }
      const p = Promise.resolve(found) as any;
      p.select = () => Promise.resolve(found);
      return p;
    }),
    updateById: jest.fn(async (id: string, data: any) => {
      const existing = users.get(String(id));
      if (!existing) return null;
      Object.assign(existing, data);
      return existing;
    }),
    paginate: jest.fn(async (_filter: any, skip: number, limit: number) => {
      const all = Array.from(users.values()).filter((u) => !u.isDeleted);
      return { items: all.slice(skip, skip + limit), total: all.length };
    }),
    softDelete: jest.fn(async (id: string) => {
      const u = users.get(String(id));
      if (u) {
        u.isDeleted = true;
        u.deletedAt = new Date();
      }
      return u || null;
    })
  });

  // Wire ProjectRepository
  Object.assign(projectRepository, {
    create: jest.fn(async (data: any) => createDoc(projects, data)),
    findById: jest.fn(async (id: string) => projects.get(String(id)) || null),
    findByCode: jest.fn(async (code: string) => {
      for (const p of projects.values()) {
        if (p.projectCode === code && !p.isDeleted) return p;
      }
      return null;
    }),
    updateById: jest.fn(async (id: string, data: any) => {
      const existing = projects.get(String(id));
      if (!existing) return null;
      Object.assign(existing, data);
      return existing;
    }),
    paginate: jest.fn(async (_filter: any, skip: number, limit: number) => {
      const all = Array.from(projects.values()).filter((p) => !p.isDeleted);
      return { items: all.slice(skip, skip + limit), total: all.length };
    }),
    softDelete: jest.fn(async (id: string) => {
      const p = projects.get(String(id));
      if (p) {
        p.isDeleted = true;
        p.deletedAt = new Date();
      }
      return p || null;
    })
  });

  // Wire ContractorRepository
  Object.assign(contractorRepository, {
    create: jest.fn(async (data: any) => createDoc(contractors, data)),
    findById: jest.fn(async (id: string) => contractors.get(String(id)) || null)
  });

  // Wire PaymentRepository
  Object.assign(paymentRepository, {
    create: jest.fn(async (data: any) => createDoc(payments, data)),
    findById: jest.fn(async (id: string) => payments.get(String(id)) || null),
    findByPfms: jest.fn(async (pfms: string) => {
      for (const p of payments.values()) {
        if (p.pfmsTransactionId === pfms.toUpperCase()) return p;
      }
      return null;
    }),
    paginate: jest.fn(async (_filter: any, skip: number, limit: number) => {
      const all = Array.from(payments.values()).filter((p) => !p.isDeleted);
      return { items: all.slice(skip, skip + limit), total: all.length };
    }),
    sumByProject: jest.fn(async (projId: string) => {
      let sum = 0;
      for (const p of payments.values()) {
        if (String(p.project) === String(projId)) sum += Number(p.amount || 0);
      }
      return [{ _id: projId, total: sum }];
    })
  });

  // Wire AuditRepository
  Object.assign(auditRepository, {
    create: jest.fn(async (data: any) => createDoc(auditReports, data)),
    findById: jest.fn(async (id: string) => auditReports.get(String(id)) || null),
    updateById: jest.fn(async (id: string, data: any) => {
      const r = auditReports.get(String(id));
      if (!r) return null;
      Object.assign(r, data);
      return r;
    })
  });

  // Wire NotificationRepository
  Object.assign(notificationRepository, {
    create: jest.fn(async (data: any) => {
      const doc = createDoc(notifications, data);
      doc.isRead = data.isRead ?? data.read ?? false;
      return doc;
    }),
    findByUser: jest.fn(async (userId: string, skip: number, limit: number) => {
      const list = Array.from(notifications.values()).filter((n) => String(n.user) === String(userId));
      return [list.slice(skip, skip + limit), list.length];
    }),
    markRead: jest.fn(async (id: string, _userId: string) => {
      const n = notifications.get(String(id));
      if (n) {
        n.isRead = true;
        n.read = true;
      }
      return n || null;
    })
  });

  // Wire AiResultRepository
  Object.assign(aiResultRepository, {
    create: jest.fn(async (data: any) => createDoc(aiResults, data)),
    listByEntity: jest.fn(async (type: string, id: string) => {
      return Array.from(aiResults.values()).filter((a) => a.entityType === type && String(a.entityId) === String(id));
    })
  });

  // Wire ActivityLogRepository
  Object.assign(activityLogRepository, {
    create: jest.fn().mockResolvedValue({})
  });

  // Model Mock Hookups for Direct Test Setups
  (ActivityLogModel as any).create = jest.fn().mockResolvedValue({});
  (UserModel as any).create = jest.fn(async (data: any) => createDoc(users, data));
  (UserModel as any).findById = jest.fn((id: any) => {
    const result = users.get(String(id)) || null;
    const p = Promise.resolve(result) as any;
    p.exec = async () => result;
    p.select = () => p;
    return p;
  });
  (ProjectModel as any).create = jest.fn(async (data: any) => createDoc(projects, data));
  (ContractorModel as any).create = jest.fn(async (data: any) => createDoc(contractors, data));
  (PaymentModel as any).create = jest.fn(async (data: any) => createDoc(payments, data));
  (AuditReportModel as any).create = jest.fn(async (data: any) => createDoc(auditReports, data));
  (NotificationModel as any).create = jest.fn(async (data: any) => createDoc(notifications, data));
  (AiResultModel as any).create = jest.fn(async (data: any) => createDoc(aiResults, data));
  (AiResultModel as any).findOne = jest.fn((query: any) => {
    let result: any = null;
    for (const a of aiResults.values()) {
      if (query?.requestId && a.requestId === query.requestId) {
        result = a;
        break;
      }
    }
    const p = Promise.resolve(result) as any;
    p.exec = async () => result;
    return p;
  });
};

export const teardownTestDb = async (): Promise<void> => {
  clearTestDb();
};

export const clearTestDb = async (): Promise<void> => {
  users.clear();
  projects.clear();
  contractors.clear();
  payments.clear();
  auditReports.clear();
  notifications.clear();
  aiResults.clear();
};

export const createTestUserAndToken = async (
  role: UserRole = UserRole.ADMIN,
  customProfile: Record<string, unknown> = {}
) => {
  const user = await UserModel.create({
    email: `test_${role.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`,
    password: bcrypt.hashSync("Password123!", 4),
    role,
    status: UserStatus.ACTIVE,
    verification: { emailVerified: true },
    profile: {
      fullName: `Test ${role} User`,
      state: "Maharashtra",
      district: "Pune",
      ...customProfile
    }
  });

  const sessionId = "test-session-" + Date.now() + Math.random().toString(36);
  const refreshToken = signRefreshToken({ sub: user.id, sessionId });

  await sessionService.createSession({
    sessionId,
    userId: user.id,
    refreshToken,
    deviceId: "test-device",
    userAgent: "jest-agent",
    ip: "127.0.0.1"
  });

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    sessionId
  });

  return { user, accessToken, sessionId };
};
