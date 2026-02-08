import { streamText, tool } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const travelResponseSchema = z.object({
  riskLevel: z
    .enum(["low", "medium", "high", "unknown"])
    .describe("Overall risk level: low, medium, high, or unknown"),
  destination: z.string().describe("The destination country or region"),
  keyReasons: z
    .array(z.string())
    .describe("Key reasons for the risk assessment"),
  clarifyingQuestions: z
    .array(z.string())
    .describe("Follow-up questions for clarification"),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        publishedDate: z.string(),
        publisher: z.string(),
      })
    )
    .describe("Relevant sources"),
  nextSteps: z
    .array(z.string())
    .describe("Recommended actions to take"),
});

const dbQueryInputSchema = z.object({
  action: z
    .enum(["schema", "query", "table-info"])
    .describe("Database action to perform"),
  sql: z
    .string()
    .optional()
    .describe("SQL query to execute"),
  tableName: z
    .string()
    .optional()
    .describe("Table name"),
  params: z
    .array(z.string())
    .optional()
    .describe("Query parameters"),
});

const SYSTEM_PROMPT = `You are a knowledgeable immigration advisor specializing in U.S. immigration law for visa holders (F-1, H-1B, L-1, O-1, J-1, B-1/B-2, TN, E-2). You can help with travel risk assessments, visa status questions, work authorization, OPT/CPT guidance, visa transfers, change of status, and general immigration compliance.

You have access to a Neon PostgreSQL database with the following tables:
- uscis_pages: Scraped USCIS web pages with raw content
- uscis_alerts: USCIS alerts extracted from pages (alert_title, alert_type, alert_content, is_critical)
- immigration_forms: Immigration forms with filing addresses, fees, processing times (form_number, form_title, filing_addresses, filing_fees, processing_times)
- content_changes: Tracked changes to page content (change_type, change_summary, detected_at, notified)
- page_topics: Topics extracted from pages (topic, relevance_score)
- notification_subscriptions: User notification preferences (user_id, subscription_type, subscription_value, notification_method)

When the user asks about traveling to a specific destination, use the assessTravelRisk tool to present a structured risk assessment card. Add a brief conversational message before or after the tool call.

When the user asks about data in the database (forms, alerts, pages, changes), use the queryDatabase tool with action "query" to retrieve it.

When the user asks a conceptual question about immigration topics, policies, or procedures, use the semanticSearch tool to find the most relevant USCIS content. This searches through embedded page chunks using vector similarity.

For general immigration questions, visa status inquiries, work authorization, or follow-ups, respond with helpful text directly.

When assessing travel risk, consider:
1. Current U.S. State Department travel advisories for the destination
2. Potential impact on the traveler's U.S. visa status and re-entry
3. Whether the traveler may need a new visa stamp to return
4. Risks of visa revocation, administrative processing, or port-of-entry issues
5. Country-specific entry/exit requirements
6. Current geopolitical factors that may affect travel

Always err on the side of caution. If you are uncertain, use "unknown" as the risk level.

Important: Do NOT provide legal advice. Frame your responses as general information and always recommend consulting a DSO (Designated School Official) or immigration attorney.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, userProfile } = req.body;
    console.log("[chat] userProfile received:", userProfile ? JSON.stringify(userProfile) : "NONE");

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'messages' field" });
    }

    // Convert messages from useChat format (with parts array) to standard format
    const formattedMessages = messages
      .filter((msg) => msg.role && (msg.content || msg.parts))
      .map((msg) => {
        if (msg.parts && Array.isArray(msg.parts)) {
          const textContent =
            msg.content ||
            msg.parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("\n");

          return {
            role: msg.role,
            content: textContent,
          };
        }

        return {
          role: msg.role,
          content: msg.content,
        };
      });

    let systemPrompt = SYSTEM_PROMPT;
    if (userProfile) {
      const profileLines = [
        `\n\n--- USER PROFILE (from onboarding) ---`,
        `Citizenship: ${userProfile.citizenship}`,
        `Visa Status: ${userProfile.visaStatus}`,
        `Affiliation Type: ${userProfile.affiliationType}`,
        `Affiliation: ${userProfile.affiliation}`,
      ];
      if (userProfile.hasTravelPlans) {
        profileLines.push(`Has Travel Plans: Yes`);
        if (userProfile.travelDestination) profileLines.push(`Travel Destination: ${userProfile.travelDestination}`);
        if (userProfile.travelDepartureDate) profileLines.push(`Departure Date: ${userProfile.travelDepartureDate}`);
        if (userProfile.travelReturnDate) profileLines.push(`Return Date: ${userProfile.travelReturnDate}`);
      }
      profileLines.push(`---`);
      profileLines.push(`Use this profile to personalize your responses. You already know the user's visa type, citizenship, and affiliation — reference them naturally without asking again.`);
      systemPrompt += profileLines.join('\n');
    }
    console.log("[chat] system prompt includes profile:", systemPrompt.includes('USER PROFILE'));
    console.log("[chat] message count:", formattedMessages.length);

    const result = streamText({
      model: anthropic("claude-haiku-4-5"),
      system: systemPrompt,
      messages: formattedMessages,
      tools: {
        assessTravelRisk: tool({
          description:
            "Present a structured travel risk assessment card to the user. Use this when the user asks about traveling to a specific destination.",
          inputSchema: travelResponseSchema,
          execute: async (input) => {
            console.log("[assessTravelRisk] Called with destination:", input.destination, "riskLevel:", input.riskLevel);
            return input;
          },
        }),
        semanticSearch: tool({
          description:
            "Search USCIS content semantically. Use this when the user asks conceptual questions about immigration topics, policies, or procedures. Returns the most relevant page chunks ranked by similarity.",
          inputSchema: z.object({
            query: z.string().describe("The search query text"),
            limit: z.number().optional().default(5).describe("Number of results to return"),
            table: z.enum(["chunks", "pages"]).optional().default("chunks").describe("Search chunks (detailed) or full pages"),
          }),
          execute: async (input) => {
            console.log("[semanticSearch] Called with:", JSON.stringify(input));
            try {
              const baseUrl = process.env.VERCEL_URL
                ? "https://" + process.env.VERCEL_URL
                : "http://localhost:3000";
              const response = await fetch(`${baseUrl}/api/semantic-search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
              });
              const result = await response.json();
              console.log("[semanticSearch] Response status:", response.status, "Results count:", result.results?.length ?? 0, "Success:", result.success);
              return result;
            } catch (error) {
              console.error("[semanticSearch] Error:", error.message);
              return {
                success: false,
                error: `Semantic search failed: ${error.message}`,
              };
            }
          },
        }),
        queryDatabase: tool({
          description:
            "Query the Neon PostgreSQL database for schema, table info, or execute SELECT queries.",
          inputSchema: dbQueryInputSchema,
          execute: async (input) => {
            console.log("[queryDatabase] Called with:", JSON.stringify(input));
            try {
              const baseUrl = process.env.VERCEL_URL
                ? "https://" + process.env.VERCEL_URL
                : "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/db-query`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(input),
                }
              );
              const result = await response.json();
              console.log("[queryDatabase] Response status:", response.status, "Result:", JSON.stringify(result).slice(0, 500));
              return result;
            } catch (error) {
              console.error("[queryDatabase] Error:", error.message);
              return {
                success: false,
                error: `Failed to query database: ${error.message}`,
              };
            }
          },
        }),
      },
      maxSteps: 3,
    });

    result.pipeUIMessageStreamToResponse(res);
  } catch (error) {
    console.error("Travel check API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
