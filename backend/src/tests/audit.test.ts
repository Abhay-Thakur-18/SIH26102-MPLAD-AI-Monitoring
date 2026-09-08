import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { AuditStatus, UserRole } from "../config/constants";
import { ProjectModel } from "../models/project.model";
import { AuditReportModel } from "../models/auditReport.model";

describe("Audit Engine Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should assign an auditor to an audit report", async () => {
    const { user: auditor, accessToken } = await createTestUserAndToken(UserRole.AUDITOR);
    const mpId = new mongoose.Types.ObjectId().toHexString();

    const project = await ProjectModel.create({
      projectCode: "PRJ-MH-PUNE-301",
      title: "School Library Digitalization",
      description: "Digital library setup.",
      mp: mpId,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: { type: "Point", coordinates: [73.8567, 18.5204] },
      budgetSanctioned: 2000000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    });

    const report = await AuditReportModel.create({
      project: project.id,
      riskReasons: ["Discrepancy in equipment delivery notes"],
      recommendations: ["Perform ground inspection of digital assets"],
      status: AuditStatus.NOT_STARTED
    });

    const res = await request(app)
      .post(`/api/v1/audit/${report.id}/assign`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ auditorId: auditor.id });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.auditor).toBe(auditor.id);
    expect(res.body.data.status).toBe(AuditStatus.ASSIGNED);
  });

  it("should update audit status to COMPLETED", async () => {
    const { user: auditor, accessToken } = await createTestUserAndToken(UserRole.AUDITOR);
    const mpId = new mongoose.Types.ObjectId().toHexString();

    const project = await ProjectModel.create({
      projectCode: "PRJ-MH-PUNE-302",
      title: "Anganwadi Renovation",
      description: "Renovation and sanitation facility upgrade.",
      mp: mpId,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: { type: "Point", coordinates: [73.8567, 18.5204] },
      budgetSanctioned: 1500000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    });

    const report = await AuditReportModel.create({
      project: project.id,
      assignedAuditor: auditor.id,
      status: AuditStatus.ASSIGNED,
      riskReasons: [],
      recommendations: []
    });

    const res = await request(app)
      .patch(`/api/v1/audit/${report.id}/status`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status: AuditStatus.COMPLETED,
        notes: "Field audit concluded satisfactorily. No anomalies observed."
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe(AuditStatus.COMPLETED);
  });
});
