import { expect, jest } from "@jest/globals";

jest.unstable_mockModule("music-metadata", () => ({
  parseFile: jest.fn(),
}));

jest.unstable_mockModule("../../utils/logger.js", () => ({
  loggerConfig: { level: "info" },
  default: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const { getDuration } = await import("../../utils/content-duration");
const { parseFile } = await import("music-metadata");
const { default: logger } = await import("../../utils/logger.js");

describe("getDuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return a math round with a valid path", async () => {
    parseFile.mockResolvedValue({
      format: { duration: 120.6 },
    });

    const duration = await getDuration("music.mp3");

    expect(duration).toBe(121);
    expect(parseFile).toHaveBeenCalledWith("music.mp3");
  });

  test("should return 0 with invalid path", async () => {
    const duration = await getDuration(null);

    expect(duration).toBe(0);
    expect(parseFile).not.toHaveBeenCalled();
  });

  test("should return 0 and log a error if parseFile fail", async () => {
    const mockError = new Error("Read Error");
    parseFile.mockRejectedValue(mockError);

    const duration = await getDuration("error.mp4");

    expect(duration).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error getting duration"),
      expect.objectContaining({ error: "Read Error" }),
    );
  });

  test("should return 0 if duration not exists in meta-data", async () => {
    parseFile.mockResolvedValue({
      format: {},
    });

    const duration = await getDuration("no-meta-data.mp3");

    expect(duration).toBe(0);
  });
});
