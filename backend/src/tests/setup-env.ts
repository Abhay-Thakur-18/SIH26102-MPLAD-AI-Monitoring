process.env.NODE_ENV = "test";
process.env.PORT = "8081";
process.env.API_PREFIX = "/api/v1";
process.env.APP_NAME = "AEGIS-MPLADS-AI";
process.env.APP_URL = "http://localhost:8081";
process.env.FRONTEND_ORIGIN = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/aegis_test";
process.env.REDIS_URL = "redis://127.0.0.1:6379";
process.env.JWT_ACCESS_SECRET = "test_access_secret_key_32_chars_min_length!";
process.env.JWT_REFRESH_SECRET = "test_refresh_secret_key_32_chars_min_length!";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.BCRYPT_SALT_ROUNDS = "4";
process.env.OTP_TTL_SECONDS = "300";
process.env.OTP_LENGTH = "6";
process.env.INTERNAL_API_KEY = "test_internal_ai_gateway_key_secure_2026";
process.env.AI_SERVICE_URL = "http://localhost:8000";
process.env.RATE_LIMIT_MAX = "50000";
process.env.RATE_LIMIT_WINDOW_MS = "60000";

// Mock BullMQ Queues and Workers to prevent Redis connection attempts during tests
jest.mock("bullmq", () => {
  return {
    Queue: jest.fn().mockImplementation(() => ({
      add: jest.fn().mockResolvedValue({ id: "mock-job-id" }),
      close: jest.fn().mockResolvedValue(undefined)
    })),
    Worker: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

// Mock ioredis client
jest.mock("ioredis", () => {
  const memoryStore = new Map<string, string>();
  return jest.fn().mockImplementation(() => ({
    status: "ready",
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue("OK"),
    on: jest.fn(),
    get: jest.fn(async (key: string) => memoryStore.get(key) || null),
    set: jest.fn(async (key: string, val: string) => {
      memoryStore.set(key, val);
      return "OK";
    }),
    del: jest.fn(async (key: string) => {
      memoryStore.delete(key);
      return 1;
    }),
    sadd: jest.fn().mockResolvedValue(1),
    srem: jest.fn().mockResolvedValue(1),
    smembers: jest.fn().mockResolvedValue([]),
    expire: jest.fn().mockResolvedValue(1)
  }));
});
