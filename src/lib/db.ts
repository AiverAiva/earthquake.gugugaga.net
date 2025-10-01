// lib/db.ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRE_URL, 
});

export default pool;
