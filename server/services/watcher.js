import chokidar from "chokidar";
import path from "path";
import { getMetaData } from "./get-meta-data.js";
import PQueue from "p-queue";

class Watcher {
  #pending_dir;
  #processed_dir;
  #queue;

  constructor() {
    this.#processed_dir = path.join(process.cwd(), "downloads", "processed");
    this.#pending_dir = path.join(process.cwd(), "downloads", "pending");

    this.#queue = new PQueue({ concurrency: 1 });
  }

  watchPedingFolder() {
    const watcher = chokidar.watch(this.#pending_dir, {
      ignored: /(ˆ|[\/\\])\../,
      persistent: true,
      depth: 0,
      awaitWriteFinish: {
        stabilityThreshold: 3000,
        pollInterval: 100,
      },
    });

    watcher.on("add", (filePath) => {
      if (path.extname(filePath) === ".m4a") {
        this.#queue.add(() => this.processM4A(filePath));
      }
    });
  }

  async processM4A(filePath) {
    const fileName = path.basename(filePath);
    try {
      const metaData = await getMetaData(filePath);
      const cleanName = metaData.title
        ? `${metaData.artist} - ${metaData.title}`.replace(/[\\/:*?"<>|]/g, "")
        : path.parse(fileName).name;

      const extension = path.extname(filePath);
      const finalName = `${cleanName}${extension}`;

      this.moveFileToProcessedDir(finalName);
    } catch (error) {}
  }

  async moveFileToProcessedDir(filePath) {
    await fs.rename(filePath, this.#processed_dir);
  }
}
