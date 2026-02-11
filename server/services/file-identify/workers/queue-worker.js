import { getFingerPrint } from "../../utils/fingerprint.js";
import { lookupAcousticID } from "../../utils/acousticID.js";
import { getCoverUrl } from "../../utils/coverart.js";
import { getDuration } from "../../utils/content-duration.js";
import { getBestRelease, getRecording } from "../../utils/musicbrainz.js";

// TODO: fix error handling
export async function getMetaData(path) {
  const fp = await getFingerPrint(path);

  const acousticID = await lookupAcousticID(fp);
  if (!acousticID) {
    throw new Error("Erro on fp");
  }

  const rec = acousticID.recorfings?.[0];
  if (!rec) throw new Error("No recording");

  const mb = await getRecording(fp);

  const realese = getBestRelease(mb.realeases);

  return {
    title: mb.title,
    artist: mb["artist-credit"]?.[0]?.artist?.name,
    album: realese?.title,
    duration: fp.duration,
    cover: release ? getCoverUrl(realese.id) : null,
    score: acousticID.score,
  };
}
