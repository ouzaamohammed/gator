import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { readConfig } from "../../config";

const config = readConfig();
const client = postgres(config.dbUrl);
export const db = drizzle(client, { schema });
