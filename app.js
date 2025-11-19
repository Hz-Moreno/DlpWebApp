const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

app.use(express.json());
app.use(express.static("public"));

const outputDir = path.join(__dirname, "downloads");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

app.post("/download", (req, res) => {
  const { url, type } = req.body;

  if (!url) return res.status(400).send("URL invalid!");

  const outputTemplate = path.join(outputDir, "%(title)s.%(ext)s");

  const args = [url, "-o", outputTemplate];

  if (type === "mp3") {
    args.push("-f", "bestaudio", "-x", "--audio-format", "mp3");
  } else {
    args.push(
      "--merge-output-format",
      "mp4",
      "--remux-video",
      "mp4",
      "-S",
      "vcodec:h264,lang,quality,res,fps,hdr:12,acodec:aac",
    );
  }

  console.log("TRY DOWN STR: ", args);

  const proc = spawn("yt-dlp", args);

  proc.stderr.on("data", (data) => {
    console.error(`yt-dlp: ${data}`);
  });
  proc.stdout.on("data", (data) => console.log("yt-dlp:", data.toString()));

  proc.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).send("Error on yt-dlp");
    }

    try {
      const files = fs.readdirSync(outputDir);
      if (files.length === 0) {
        return res.status(500).send("No file generated!");
      }

      const latestFile = files
        .map((file) => ({
          name: file,
          mtime: fs.statSync(path.join(outputDir, file)).mtime,
        }))
        .sort((a, b) => b.mtime - a.mtime)[0].name;

      const filePath = path.join(outputDir, latestFile);

      res.download(filePath, latestFile, (err) => {
        if (err) {
          console.error("Error on send file: ", err);
          if (!res.headersSent) res.status(500).send("Error on send file!");
        }

        // fs.unlinkSync(filePath);
      });
    } catch (err) {
      console.log(err);
      res.status(500).sen("Internal error!");
    }
  });
});

app.get("/downloaded-files", async (req, res) => {
  const dir = "./downloads";
  try {
    const files = await fs.promises.readdir(dir);
    const fileContents = [];

    for (const file of files) {
      const content = await fs.promises.readFile(path.join(dir, file), "utf-8");
      fileContents.push({ name: file, content });
    }

    res.json(fileContents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-down/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "downloads", filename);

  if (!filePath.startsWith(path.join(__dirname, "downloads"))) {
    console.log("Error on validation!");
    return res.status(400).send("Invalid file");
  }

  if (!fs.existsSync(filePath)) {
    console.log("File not found");
    return res.status(404).send("File not found");
  }

  res.download(filePath, filename);
});

app.listen(port, () => console.log("Server on!"));
