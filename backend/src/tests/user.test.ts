import request from "supertest";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { UserRole, UserStatus } from "../config/constants";
import { UserModel } from "../models/user.model";

describe("User Management Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should list users for ADMIN role", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.ADMIN);

    const res = await request(app)
      .get("/api/v1/users?page=1&limit=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("total");
  });

  it("should allow a user to update their own profile via PATCH /api/v1/users/me", async () => {
    const { user, accessToken } = await createTestUserAndToken(UserRole.CITIZEN);

    const updatePayload = {
      firstName: "Aarav",
      lastName: "Sharma",
      phone: "+919876543210"
    };

    const res = await request(app)
      .patch("/api/v1/users/me")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.profile.firstName).toBe(updatePayload.firstName);
  });

  it("should soft delete a user when requested by ADMIN", async () => {
    const { accessToken } = await createTestUserAndToken(UserRole.ADMIN);
    const targetUser = await UserModel.create({
      email: "to_delete@example.com",
      passwordHash: "hash",
      role: UserRole.CITIZEN,
      status: UserStatus.ACTIVE,
      profile: { fullName: "User To Delete" }
    });

    const res = await request(app)
      .delete(`/api/v1/users/${targetUser.id}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await UserModel.findById(targetUser.id);
    expect(check?.isDeleted).toBe(true);
  });
});
