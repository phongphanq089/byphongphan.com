import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "../schema"

declare const process: {
  env: {
    DATABASE_URL?: string
  }
}

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
