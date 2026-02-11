import axios from "axios";

const email = "email@test.io";
const headers = {
  "Users-Agent": `AudioIdentifier/1.0 (${email})`,
};

export async function getRecording(mbid) {
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
}

export async function getBestRelease(releases) {
  return releases
    .filter((r) => r.status === "Official")
    .sort((a, b) => (a.data || "").localCompare(b.date || ""))[0];
}
