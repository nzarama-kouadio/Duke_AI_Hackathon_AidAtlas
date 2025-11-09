import { buildServer } from "./app.js";
import { loadEnv } from "./config/env.js";

const start = async () => {
  const env = loadEnv();
  const server = await buildServer();

  try {
    await server.listen({ port: Number(env.PORT), host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err, "Failed to start AidAtlas API server");
    process.exit(1);
  }
};

void start();
