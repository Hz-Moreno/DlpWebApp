import fs from "fs";
import path from "path";
import { spawn } from "child_process";

export class DLPService {
  #output_dir;
  #output_template;
  #downloads = new Map();

  constructor() {
    this.setOutputDir();
    this.setOutputTemplate();
  }

  getDownloadStatus(id) {
    return this.#downloads.get(id) || { status: "not_dound" };
  }

  setOutputDir() {
    const rootPath = process.cwd();
    const output_dir = path.join(rootPath, "downloads", "pending");
    this.#output_dir = output_dir;
  }

  setOutputTemplate() {
    const outputTemplate = path.join(this.#output_dir, "%(title)s.%(ext)s");
    this.#output_template = outputTemplate;
  }

  setDlpMp4Args(url) {
    if (!url) return;

    const args = [
      url,
      "-o",
      this.#output_template,
      "--merge-output-format",
      "mp4",
      "--remux-video",
      "mp4",
      "-S",
      "vcodec:h264,lang,quality,res,fps,hdr:12,acodec:aac",
    ];

    return args;
  }

  setDlpAACArgs(url) {
    if (!url) return;

    const args = [
      url,
      "-o",
      this.#output_template,
      "-f",
      "bestaudio",
      "-x",
      "--audio-format",
      "aac",
    ];

    return args;
  }

  async download(id, args) {
    this.#downloads.set(id, { percent: 0, status: "processing" });
    if (!args) throw new Error("Invalid downlaod args");

    return new Promise((resolve, reject) => {
      const proc = spawn("yt-dlp", [
        ...args,
        "--newline",
        "--progress-template",
        "progress:%(progress._percent_str)s",
      ]);

      proc.stdout.on("data", (data) => {
        const output = data.toString();
        const match = output.match(/progress:\s*([\d.]+)%/);

        if (match) {
          const percent = parseFloat(match[1]);
          if (percent === 100) {
            this.#downloads.set(id, { percent, status: "processing file" });
          } else {
            this.#downloads.set(id, { percent, status: "downloading" });
          }
          console.log(`[ID: ${id} progress: ${percent}%`);
        }
      });

      proc.on("close", (code) => {
        if (code === 0) {
          this.#downloads.set(id, { percent: 100, status: "complete" });
          resolve({ success: true, message: "Download complete!" });
        } else {
          reject(new Error(`yt-dlp error code: ${code}`));
        }
      });
    });
  }
}
