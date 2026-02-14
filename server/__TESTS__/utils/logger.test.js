import { expect, jest } from "@jest/globals";

describe("Logger Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("should use default log level 'info' when LOG_LEVEL is not set", async () => {
    delete process.env.LOG_LEVEL;

    const { loggerConfig } = await import("../../utils/logger.js?1");
    expect(loggerConfig.level).toBe("info");
  });

  test("should respect LOG_LEVEL environment variable", async () => {
    process.env.LOG_LEVEL = "debug";

    const { loggerConfig } = await import("../../utils/logger.js?2");
    expect(loggerConfig.level).toBe("debug");
  });

  test("should enable pino-pretty transport when NODE_ENV is not production", async () => {
    process.env.NODE_ENV = "development";

    const { loggerConfig } = await import("../../utils/logger.js?3");
    expect(loggerConfig.transport.target).toBe("pino-pretty");
  });

  test("should disable transport in production mode", async () => {
    process.env.NODE_ENV = "production";

    const { loggerConfig } = await import("../../utils/logger.js?4");
    expect(loggerConfig.transport).toBeUndefined();
  });
});
