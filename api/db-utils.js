import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * Extract schema information from the database
 * Returns table names, columns, types, and constraints
 */
export async function extractSchema() {
  try {
    const query = `
      SELECT
        t.table_name,
        json_agg(
          json_build_object(
            'name', c.column_name,
            'type', c.data_type,
            'nullable', c.is_nullable = 'YES',
            'default', c.column_default,
            'max_length', c.character_maximum_length
          ) ORDER BY c.ordinal_position
        ) as columns
      FROM
        information_schema.tables t
        LEFT JOIN information_schema.columns c
          ON t.table_name = c.table_name AND t.table_schema = c.table_schema
      WHERE
        t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      GROUP BY
        t.table_name
      ORDER BY
        t.table_name;
    `;

    const { rows } = await pool.query(query);

    return {
      success: true,
      schema: rows.reduce((acc, row) => {
        acc[row.table_name] = row.columns || [];
        return acc;
      }, {}),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Execute a SELECT query safely
 * Only allows SELECT statements, limits results to 1000 rows
 */
export async function executeQuery(sql, params = []) {
  try {
    // Validate that it's a SELECT query
    const trimmedSql = sql.trim().toUpperCase();
    if (!trimmedSql.startsWith('SELECT')) {
      return {
        success: false,
        error: 'Only SELECT queries are allowed',
      };
    }

    // Set statement timeout to prevent long-running queries
    await pool.query('SET statement_timeout = 10000'); // 10 seconds

    const { rows } = await pool.query(sql, params);

    // Limit results
    const limitedRows = rows.slice(0, 1000);

    return {
      success: true,
      rowCount: rows.length,
      rows: limitedRows,
      wasTruncated: rows.length > 1000,
      truncatedAt: 1000,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get table-specific information
 */
export async function getTableInfo(tableName) {
  try {
    const query = `
      SELECT
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        tc.constraint_type
      FROM
        information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_name = kcu.table_name
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name
      WHERE
        c.table_name = $1
        AND c.table_schema = 'public'
      ORDER BY
        c.ordinal_position;
    `;

    const { rows } = await pool.query(query, [tableName]);

    return {
      success: true,
      table: tableName,
      columns: rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
