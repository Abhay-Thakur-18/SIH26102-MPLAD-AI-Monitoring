import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/tests"],
  testMatch: ["**/*.test.ts"],
  setupFiles: ["<rootDir>/src/tests/setup-env.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/services/**/*.ts",
    "src/middleware/**/*.ts",
    "src/controllers/**/*.ts",
    "src/utils/**/*.ts"
  ]
};

export default config;
