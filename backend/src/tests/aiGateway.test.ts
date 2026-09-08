import request from "supertest";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { UserRole } from "../config/constants";
import { AiResultModel } from "../models/aiResult.model";

describe("AI Gateway Integration Tests", () => {
  const originalFetch = global.fetch;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
    global.fetch = originalFetch;
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should forward risk prediction to AI microservice and persist prediction record", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.DISTRICT_AUTHORITY);

    const mockAiResponse = {
      requestId: "mock-ai-req-12345",
      modelName: "XGBoost-MPLADS-RiskPredictor-v2",
      confidence: 0.92,
      riskScore: 48.5,
      status: "EVALUATED",
      prediction: { riskClassification: "MEDIUM" },
      explanation: "Project risk evaluated at 48.5%.",
      metadata: { features: ["budget", "timeline"] },
      timestamp: new Date().toISOString()
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAiResponse
    } as unknown as Response);

    const payload = {
      projectId: "66db1e23f9a7123456789abc",
      budget: 5000000,
      disbursed: 2000000
    };

    const res = await request(app)
      .post("/api/v1/ai/risk-prediction")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.modelName).toBe(mockAiResponse.modelName);
    expect(res.body.data.riskScore).toBe(mockAiResponse.riskScore);

    // Verify record was persisted in MongoDB
    const persisted = await AiResultModel.findOne({ requestId: mockAiResponse.requestId });
    expect(persisted).not.toBeNull();
    expect(persisted?.riskScore).toBe(mockAiResponse.riskScore);
  });

  it("should return history of AI predictions for an entity", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.DISTRICT_AUTHORITY);
    const projectId = "66db1e23f9a7123456789abc";

    await AiResultModel.create({
      requestId: "hist-req-1",
      modelName: "XGBoost-MPLADS",
      confidence: 0.9,
      riskScore: 25,
      status: "EVALUATED",
      prediction: {},
      explanation: "Low risk project",
      metadata: {},
      entityType: "project",
      entityId: projectId
    });

    const res = await request(app)
      .get(`/api/v1/ai/history/project/${projectId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].requestId).toBe("hist-req-1");
  });
});
