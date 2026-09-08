import request from "supertest";
import app from "../app";
import { setupTestDb, teardownTestDb, clearTestDb, createTestUserAndToken } from "./testHelper";
import { NotificationChannel, UserRole } from "../config/constants";
import { NotificationModel } from "../models/notification.model";

describe("Notification System Integration Tests", () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  it("should fetch unread notifications for logged in user", async () => {
    const { user, accessToken } = await createTestUserAndToken(UserRole.CITIZEN);

    await NotificationModel.create({
      user: user.id,
      title: "Project Milestone Updated",
      message: "Milestone 1 for Primary Health Center has been marked completed.",
      channel: NotificationChannel.IN_APP,
      read: false
    });

    const res = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].read).toBe(false);
  });

  it("should mark notification as read", async () => {
    const { user, accessToken } = await createTestUserAndToken(UserRole.CITIZEN);

    const notification = await NotificationModel.create({
      user: user.id,
      title: "Risk Alert",
      message: "Anomaly detected on project disbursement.",
      channel: NotificationChannel.IN_APP,
      read: false
    });

    const res = await request(app)
      .patch(`/api/v1/notifications/${notification.id}/read`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.read).toBe(true);
  });
});
