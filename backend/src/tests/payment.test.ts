import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { PaymentStage, UserRole } from "../config/constants";
import { ProjectModel } from "../models/project.model";
import { ContractorModel } from "../models/contractor.model";

describe("Financial Monitoring & Payment Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should record a new payment transaction with PFMS ID", async () => {
    const { user, accessToken } = await createTestUserAndToken(UserRole.DISTRICT_AUTHORITY);

    const contractor = await ContractorModel.create({
      organization: "Reliable Infra Projects Ltd",
      pan: "ABCDE1234F",
      gst: "27ABCDE1234F1Z5",
      district: "Pune",
      contactPerson: "Mahesh Joshi",
      phone: "+919822001122",
      email: "mahesh@reliableinfra.in"
    });

    const project = await ProjectModel.create({
      projectCode: "PRJ-MH-PUNE-201",
      title: "Village Drinking Water Pipeline",
      description: "Pipeline installation across 3 wadis.",
      mp: user.id,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: { type: "Point", coordinates: [73.8567, 18.5204] },
      budgetSanctioned: 4000000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    });

    const payload = {
      pfmsTransactionId: "PFMS-MH-2026-990011",
      project: project.id,
      vendor: contractor.id,
      amount: 1500000,
      paymentStage: PaymentStage.ADVANCE,
      notes: "Mobilization advance approved by Collectorate."
    };

    const res = await request(app)
      .post("/api/v1/payments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pfmsTransactionId).toBe(payload.pfmsTransactionId);
    expect(res.body.data.amount).toBe(payload.amount);
  });

  it("should retrieve budget summary for a project", async () => {
    const { user, accessToken } = await createTestUserAndToken(UserRole.DISTRICT_AUTHORITY);

    const project = await ProjectModel.create({
      projectCode: "PRJ-MH-PUNE-202",
      title: "Community Hall Construction",
      description: "Multipurpose hall for gram panchayat.",
      mp: user.id,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: { type: "Point", coordinates: [73.8567, 18.5204] },
      budgetSanctioned: 5000000,
      budgetReleased: 2500000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
    });

    const res = await request(app)
      .get(`/api/v1/payments/project/${project.id}/budget`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("budgetSanctioned", 5000000);
    expect(res.body.data).toHaveProperty("remainingBudget");
  });
});
