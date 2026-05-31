import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

const mongoClient = new MongoClient(env.mongo.uri);
let mongoDb;

export async function connectMongo() {
  if (!mongoDb) {
    await mongoClient.connect();
    mongoDb = mongoClient.db(env.mongo.dbName);
  }

  return mongoDb;
}

export function getMongoDb() {
  if (!mongoDb) {
    throw new Error("MongoDB no esta conectado");
  }

  return mongoDb;
}
