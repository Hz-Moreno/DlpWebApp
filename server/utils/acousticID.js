import axios from "axios";

export async function lookupAcousticID({ fingerprint, duration }) {
  const { data } = await axios.get("https://api.acoustid.org/v2/lookup", {
    params: {
      client: process.env.ACOUSTID_API_KEY,
      fingerprint,
      duration,
      meta: "recordings releasegroups artists",
    },
  });

  if (!data.results?.length) return null;

  return data.results.sort((a, b) => b.score - a.score)[0];
}

export function validateScore(score) {
  return score >= 0.7;
}
