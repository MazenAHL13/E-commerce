import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pgPool = new Pool(env.postgres);
