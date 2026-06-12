import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  appEncryptionKey: process.env.APP_ENCRYPTION_KEY || "dev_demo_key_2026",
  postgres: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT || 5432),
    database: process.env.POSTGRES_DB || "ecommerce",
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres"
  },
  mongo: {
    uri:
      process.env.MONGO_URI ||
      "mongodb://root:example@localhost:27018/ecommerce?authSource=admin",
    dbName: process.env.MONGO_DB || "ecommerce"
  }
};
