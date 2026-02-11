export class DownloadController {
  #download_service;
  constructor(download_service) {
    this.#download_service = download_service;
  }

  handle = async (request, reply) => {
    const { url, format } = request.body;
    const downloadId = Math.random().toString(36).substring(7);

    try {
      const args =
        format === "mp4"
          ? this.#download_service.setDlpMp4Args(url)
          : this.#download_service.setDlpAACArgs(url);

      this.#download_service
        .download(downloadId, args)
        .then(() => {
          //
        })
        .catch((error) => {
          //
        });

      return reply
        .code(200)
        .send({ success: "Download requested", id: downloadId });
    } catch (error) {
      return reply.code(500).send({ error: error.message });
    }
  };

  getStatus = async (request, reply) => {
    const { id } = request.params;
    let download = this.#download_service.getDownloadStatus(id);

    if (download.status === "not_found") {
      return reply.code(404).send({
        error: "Download not found or corrupted",
      });
    }

    return reply.send(download);
  };
}
