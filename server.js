import Fastify from "fastify";
import { downloadRoutes } from "./server/routes/downloadRoutes.js";
import { createDownalodDir } from "./server/services/create-download-dir.js";

const fastify = Fastify({ logger: true });

fastify.register(downloadRoutes, { prefix: "/api" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    createDownalodDir();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
