import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    const latest = await client.query(
      `SELECT origin_time FROM earthquakes ORDER BY origin_time DESC LIMIT 1`
    );

    const earliest = await client.query(
      `SELECT origin_time FROM earthquakes ORDER BY origin_time ASC LIMIT 1`
    );

    const total = await client.query(`SELECT COUNT(*) FROM earthquakes`);

    client.release();

    return NextResponse.json({
      latest: latest.rows[0]?.origin_time || null,
      earliest: earliest.rows[0]?.origin_time || null,
      total: parseInt(total.rows[0].count, 10),
    });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Database query failed" }, { status: 500 });
  }
}
