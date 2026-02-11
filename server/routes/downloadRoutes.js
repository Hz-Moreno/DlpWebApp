import { DownloadController } from "../controllers/DownloadController.js";
import { DLPService } from "../services/dlp-service.js";
const controller = new DownloadController(new DLPService());

export async function downloadRoutes(fastify) {
  fastify.post(
    "/download",
    {
      schema: {
        body: {
          type: "object",
          required: ["url", "format"],
          properties: {
            url: { type: "string" },
            format: { type: "string", enum: ["mp4", "aac"] },
          },
        },
      },
    },
    controller.handle,
  );

  fastify.get("/download/status/:id", controller.getStatus);
}
