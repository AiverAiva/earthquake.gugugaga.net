import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate, magnitude, depth } = body;

    // Base query
    let query = `
      SELECT id, origin_time, magnitude, depth, quality, review_status, gap, rms, erh, erz,
             ST_AsGeoJSON(location) as location
      FROM earthquakes
      WHERE 1=1
    `;
    const params: unknown[] = [];

    // Apply filters if provided
    if (startDate) {
      params.push(startDate);
      query += ` AND origin_time >= $${params.length}`;
    }

    if (endDate) {
      params.push(endDate);
      query += ` AND origin_time <= $${params.length}`;
    }

    if (magnitude && magnitude.length === 2) {
      params.push(magnitude[0], magnitude[1]);
      query += ` AND magnitude BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    if (depth && depth.length === 2) {
      params.push(depth[0], depth[1]);
      query += ` AND depth BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    // Always order by most recent, limit 50
    query += ` ORDER BY origin_time ASC`;
//  LIMIT 1000  LIMIT 2500
    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("Error querying earthquakes:", err);
    return NextResponse.json(
      { error: "Failed to fetch earthquake data" },
      { status: 500 }
    );
  }
}
