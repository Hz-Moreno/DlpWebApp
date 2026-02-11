import fs from "fs";
import { decodeAudio, Chromaprint } from "@unimusic/chromaprint";

export async function getFingerPrint(path) {
  const buff = fs.readFileSync(path);
  const audio = await decodeAudio(buff);

  const chroma = new Chromaprint();
  const fingerprint = chroma.computeFingerprint(audio);

  return {
    fingerprint,
    duration: Math.rount(audio.duration),
  };
}
