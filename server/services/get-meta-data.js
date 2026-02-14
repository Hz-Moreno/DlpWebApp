import { getFingerPrint } from "../../server/utils/fingerprint.js";
import { lookupAcousticID } from "../../server/utils/acousticID.js";
import { getCoverUrl } from "../../server/utils/coverart.js";
import { getDuration } from "../../server/utils/content-duration.js";
import {
  getBestRelease,
  getRecording,
} from "../../server/utils/musicbrainz.js";
import * as mm from "music-metadata";

export async function getMetaData(filePath) {
  try {
    const [fp, duration] = await Promise.all([
      getFingerPrint(filePath).catch(() => null),
      getDuration(filePath),
    ]);

    if (fp) {
      const acousticData = await lookupAcousticID(fp);
      if (acousticData?.recordings?.length) {
        const bestMatch = acousticData.recordings[0];
        const mbRecording = await getRecording(bestMatch.id);

        if (mbRecording) {
          const bestRelease = getBestRelease(mbRecording.releases);
          return {
            source: "acoustid",
            title: mbRecording.title,
            artist: mbRecording["artist-credit"]?.[0]?.name,
            album: bestRelease?.title,
            cover: bestRelease ? await getCoverUrl(bestRelease.id) : null,
            duration,
            mbid: mbRecording.id,
          };
        }
      }
    }

    const nativeData = await mm.parseFile(filePath);
    const { common } = nativeData;

    return {
      source: "yt-dlp-native",
      title: common.title || path.basename(filePath, path.extname(filePath)),
      artist: common.artist || "Unknown Artist",
      album: common.album || "YouTube",
      duration: duration || nativeData.format.duration,
      cover: common.picture
        ? `data:${common.picture[0].format};base64,${common.picture[0].data.toString("base64")}`
        : null,
    };
  } catch (error) {
    console.log("Error on metada Data: ", error);
    return { status: error, message: error.message };
  }
}
