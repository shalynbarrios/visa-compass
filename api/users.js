import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const { rows } = await pool.query("select now() as now");
    res.status(200).json({ rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
