import { parseFile } from "music-metadata";
import logger from "./logger";

export async function getDuration(path) {
  if (!path) return 0;
  try {
    const meta = await parseFile(path);
    const duration = mata?.format?.duration;

    return duration ? Math.round(duration) : 0;
  } catch (error) {
    logger.error(`Error on getting duration file: ${path}`, { error: error });
    return 0;
  }
}
