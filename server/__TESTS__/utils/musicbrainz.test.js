import { jest } from "@jest/globals";

jest.unstable_mockModule("../../utils/logger.js", () => ({
  loggerConfig: { level: "info" },
  default: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.unstable_mockModule("axios", () => ({
  default: { get: jest.fn() },
}));

const { getRecording, getBestRelease } =
  await import("../../utils/musicbrainz.js");
const { default: axios } = await import("axios");

describe("MusicBrainz Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("must return null when MusicBrainz api fails", async () => {
    axios.get.mockRejectedValue(new Error("Network error"));

    const result = await getRecording("mbid-invalid");
    expect(result).toBeNull();
  });

  test("get MusicBrainz api data", async () => {
    const mockData = { data: { title: "Test music" } };
    axios.get.mockResolvedValue(mockData);

    const result = await getRecording("mbid-123");

    expect(result.title).toBe("Test music");
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("recording/mbid-123"),
      expect.any(Object),
    );
  });

  test("must be return oldest official release", async () => {
    const releases = [
      { status: "Official", date: "2024-01-01" },
      { status: "Official", date: "2023-01-01" },
      { status: "Bootleg", date: "2019-01-01" },
    ];

    const result = await getBestRelease(releases);
    expect(result.date).toBe("2023-01-01");
  });

  test("must return null when list is empty", async () => {
    const emptyResult = await getBestRelease([]);
    const nullResult = await getBestRelease(null);
    expect(emptyResult).toBeNull();
    expect(nullResult).toBeNull();
  });
});
