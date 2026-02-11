import fs from "fs";
import path from "path";

export function createDownalodDir() {
  const rootPath = process.cwd();
  const downloads_dir = path.join(rootPath, "downloads");

  if (!fs.existsSync(downloads_dir)) {
    fs.mkdirSync(downloads_dir);
  }

  const pending_dir = path.join(rootPath, "downloads", "pending");
  if (!fs.existsSync(pending_dir)) {
    fs.mkdirSync(pending_dir);
  }

  const processed_dir = path.join(rootPath, "downloads", "processed");
  if (!fs.existsSync(processed_dir)) {
    fs.mkdirSync(processed_dir);
  }
}
