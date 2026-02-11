import { parseFile } from "music-metadata";

export async function getDuration(path) {
  const meta = await parseFile(path);
  return Math.round(meta.format.duration);
}
