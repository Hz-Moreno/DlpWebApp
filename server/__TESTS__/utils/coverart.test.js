import { getCoverUrl } from "../../utils/coverart.js";

describe("gerCoverUrl", () => {
  test("should return a corret URL to valid IDs", () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    const expected = `https://coverartarchive.org/release/${id}/front`;

    expect(getCoverUrl(id)).toBe(expected);
  });

  test.each([[null], [undefined], [""], [0]])(
    "should return null if releaseId ID invalid",
    (input) => {
      expect(getCoverUrl(input)).toBeNull();
    },
  );
});
