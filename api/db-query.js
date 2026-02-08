import { extractSchema, executeQuery, getTableInfo } from './db-utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, sql, params = [], tableName } = req.body;
    console.log("[db-query] action:", action, "sql:", sql?.slice(0, 200), "tableName:", tableName);

    // Validate action
    if (!action) {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    let result;

    switch (action) {
      case 'schema':
        // Get the full database schema
        result = await extractSchema();
        break;

      case 'table-info':
        // Get detailed info about a specific table
        if (!tableName) {
          return res.status(400).json({ error: 'Missing tableName for table-info action' });
        }
        result = await getTableInfo(tableName);
        break;

      case 'query':
        // Execute a SELECT query
        if (!sql) {
          return res.status(400).json({ error: 'Missing SQL query' });
        }
        result = await executeQuery(sql, params);
        break;

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    console.log("[db-query] Success. Row count:", result?.rows?.length ?? result?.length ?? "N/A");
    return res.status(200).json(result);
  } catch (error) {
    console.error('[db-query] Error:', error.message);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
