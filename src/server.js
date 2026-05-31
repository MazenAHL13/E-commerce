import app from "./app.js";
import { env } from "./config/env.js";
import { pgPool } from "./db/postgres.js";

async function start() {
  await pgPool.query("SELECT 1");

  app.listen(env.port, () => {
    console.log(`API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar la API", error);
  process.exit(1);
});
