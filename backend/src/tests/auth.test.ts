import request from "supertest";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { UserRole } from "../config/constants";

describe("Authentication Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new citizen user successfully", async () => {
      const payload = {
        email: "citizen1@example.com",
        password: "Password123!",
        firstName: "Aarav",
        lastName: "Sharma",
        phone: "+919876543210",
        role: UserRole.CITIZEN
      };

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(payload.email);
    });

    it("should reject registration with invalid email", async () => {
      const payload = {
        email: "invalid-email",
        password: "Password123!",
        firstName: "Aarav",
        lastName: "Sharma"
      };

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should reject login with wrong password", async () => {
      const { user } = await createTestUserAndToken(UserRole.CITIZEN);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: user.email,
          password: "WrongPassword!",
          deviceId: "test-device-123"
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/users/me", () => {
    it("should return the authenticated user's profile", async () => {
      const { user, accessToken } = await createTestUserAndToken(UserRole.CITIZEN);

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(user.id);
    });

    it("should deny access when token is missing", async () => {
      const res = await request(app).get("/api/v1/users/me");
      expect(res.status).toBe(401);
    });
  });
});
