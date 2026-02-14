import Fastify from "fastify";
import { downloadRoutes } from "./server/routes/downloadRoutes.js";
import { createDownalodDir } from "./server/services/create-download-dir.js";
import Watcher from "./server/services/watcher.js";
import { loggerConfig } from "./server/utils/logger.js";

const fastify = Fastify({
  logger: loggerConfig,
});

fastify.register(downloadRoutes, { prefix: "/api" });

const start = async () => {
  try {
    createDownalodDir();
    const watcher = new Watcher();
    watcher.watchPedingFolder();
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
