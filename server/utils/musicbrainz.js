import axios from "axios";
import logger from "./logger.js";

const email = process.env.PRINCIPAL_EMAIL;
const headers = {
  "User-Agent": `AudioIdentifier/1.0 (${email})`,
};

export async function getRecording(mbid) {
  try {
    const { data } = await axios.get(
      `https://musicbrainz.org/ws/2/recording/${mbid}`,
      {
        params: {
          fmt: "json",
          inc: "artists+releases",
        },
        headers,
      },
    );

    return data;
  } catch (error) {
    logger.error(
      { mbid, error: error.message },
      "Error on get MusicBrainz data",
    );
    return null;
  }
}

export async function getBestRelease(releases) {
  if (!releases || releases.length === 0) return null;
  return releases
    .filter((r) => r.status === "Official")
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))[0];
}
