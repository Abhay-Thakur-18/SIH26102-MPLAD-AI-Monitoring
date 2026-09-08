import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { UserRole } from "../config/constants";

describe("Project Management Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should create a project when user has DISTRICT_AUTHORITY role", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.DISTRICT_AUTHORITY);
    const mpId = new mongoose.Types.ObjectId().toHexString();

    const payload = {
      projectCode: "PRJ-MH-PUNE-101",
      title: "Construction of Primary Health Center",
      description: "Construction of a new rural primary healthcare center equipped with solar panels.",
      mp: mpId,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: {
        type: "Point",
        coordinates: [73.8567, 18.5204]
      },
      budgetSanctioned: 5000000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString()
    };

    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.projectCode).toBe(payload.projectCode);
    expect(res.body.data.title).toBe(payload.title);
  });

  it("should reject project creation when user is CITIZEN (forbidden)", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.CITIZEN);
    const mpId = new mongoose.Types.ObjectId().toHexString();

    const payload = {
      projectCode: "PRJ-CITIZEN-FAIL",
      title: "Unauthorized Project",
      description: "This should fail because citizen cannot create projects directly.",
      mp: mpId,
      district: "Pune",
      state: "Maharashtra",
      village: "Khed",
      location: {
        type: "Point",
        coordinates: [73.8567, 18.5204]
      },
      budgetSanctioned: 1000000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 1000).toISOString()
    };

    const res = await request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should list projects with pagination", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.CITIZEN);

    const res = await request(app)
      .get("/api/v1/projects?page=1&limit=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("page", 1);
  });
});
