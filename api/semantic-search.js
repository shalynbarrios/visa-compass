import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { query, limit = 5, table = "chunks" } = req.body;
    console.log("[semantic-search] query:", query?.slice(0, 100), "table:", table, "limit:", limit);
    console.log("[semantic-search] OPENAI_API_KEY set:", !!process.env.OPENAI_API_KEY);

    if (!query) {
      return res.status(400).json({ error: "Missing query parameter" });
    }

    // Generate embedding for the query using OpenAI (matches existing 1536-dim vectors)
    console.log("[semantic-search] Generating embedding...");
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-ada-002"),
      value: query,
    });
    console.log("[semantic-search] Embedding generated, dimensions:", embedding.length);

    // Format embedding as pgvector literal
    const vectorLiteral = `[${embedding.join(",")}]`;

    let sql;
    let params;

    if (table === "pages") {
      sql = `
        SELECT
          p.id,
          p.url,
          LEFT(p.raw_content, 500) AS content_preview,
          1 - (p.embedding <=> $1::vector) AS similarity
        FROM uscis_pages p
        WHERE p.embedding IS NOT NULL
        ORDER BY p.embedding <=> $1::vector
        LIMIT $2
      `;
      params = [vectorLiteral, limit];
    } else {
      sql = `
        SELECT
          c.id,
          c.chunk_index,
          c.chunk_text,
          p.url AS source_url,
          1 - (c.embedding <=> $1::vector) AS similarity
        FROM uscis_page_chunks c
        JOIN uscis_pages p ON c.page_id = p.id
        WHERE c.embedding IS NOT NULL
        ORDER BY c.embedding <=> $1::vector
        LIMIT $2
      `;
      params = [vectorLiteral, limit];
    }

    const { rows } = await pool.query(sql, params);

    return res.status(200).json({
      success: true,
      query,
      table,
      results: rows,
    });
  } catch (error) {
    console.error("Semantic search error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
