import { jest } from "@jest/globals";

jest.unstable_mockModule("axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

jest.unstable_mockModule("../../utils/logger.js", () => ({
  loggerConfig: { level: "info" },
  default: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

const { lookupAcousticID, validateScore } =
  await import("../../utils/acousticID.js");
const { default: axios } = await import("axios");

describe("AcoustID Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACOUSTID_API_KEY = "test-key";
  });

  describe("lookupAcousticID", () => {
    test("should return the result with the highest score", async () => {
      const mockData = {
        data: {
          results: [
            { id: "low-score", score: 0.5 },
            { id: "high-score", score: 0.9 }, // Expected result
            { id: "mid-score", score: 0.7 },
          ],
        },
      };

      axios.get.mockResolvedValue(mockData);

      const result = await lookupAcousticID({
        fingerprint: "abc",
        duration: 120,
      });

      expect(result.id).toBe("high-score");
      expect(result.score).toBe(0.9);
      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            client: "test-key",
            fingerprint: "abc",
          }),
        }),
      );
    });

    test("should return null if the API returns no results", async () => {
      axios.get.mockResolvedValue({ data: { results: [] } });

      const result = await lookupAcousticID({
        fingerprint: "abc",
        duration: 120,
      });

      expect(result).toBeNull();
    });

    test("should return null if the result structure is invalid", async () => {
      axios.get.mockResolvedValue({ data: {} });

      const result = await lookupAcousticID({
        fingerprint: "abc",
        duration: 120,
      });

      expect(result).toBeNull();
    });

    test("should return null if the API request fails", async () => {
      axios.get.mockRejectedValue(new Error("Network Error"));

      const result = await lookupAcousticID({
        fingerprint: "abc",
        duration: 120,
      });

      expect(result).toBeNull();
    });
  });

  describe("validateScore", () => {
    test("should return true for scores greater than or equal to 0.7", () => {
      expect(validateScore(0.7)).toBe(true);
      expect(validateScore(0.95)).toBe(true);
    });

    test("should return false for scores lower than 0.7", () => {
      expect(validateScore(0.69)).toBe(false);
      expect(validateScore(0.1)).toBe(false);
    });
  });
});
