import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Helper to generate local fallback simulation if Gemini API Key is missing or default
function getSimulationResponse(query: string): any {
  const isSql = /sql|database|query|table|postgres/i.test(query);
  const isAws = /aws|deploy|cloud|server|docker/i.test(query);
  const isCode = /code|react|typescript|bug|fix/i.test(query);

  const sessionId = "session_" + Math.random().toString(36).substring(2, 10);
  const duration = 2400 + Math.floor(Math.random() * 1500);
  const latency = parseFloat((duration / 1000).toFixed(2));
  const inputTokens = 120 + Math.floor(Math.random() * 80);
  const outputTokens = 240 + Math.floor(Math.random() * 120);
  const totalTokens = inputTokens + outputTokens;
  const cost = parseFloat((inputTokens * 0.000000075 + outputTokens * 0.00000025).toFixed(6));

  const timestamp = new Date().toISOString();

  // Nodes definition
  const nodes = [
    { id: "user", label: "User Input", status: "completed", duration: 50, details: `Received query: "${query}"` },
    { id: "planner", label: "Task Planner", status: "completed", duration: 320, details: "Parsed query into subtasks & strategy" },
    { id: "retriever", label: "RAG Retriever", status: "completed", duration: 480, details: "Queried semantic index and vector databases" },
    { id: "memory", label: "Memory Sync", status: "completed", duration: 150, details: "Fetched long-term episodic context" },
    { id: "tools", label: "Tool Execution", status: "completed", duration: 750, details: "Executed tools with exact parameter matching" },
    { id: "gemini", label: "Gemini Model", status: "completed", duration: 1100, details: "Generated candidate response with schema compliance" },
    { id: "validator", label: "Validator Guard", status: "completed", duration: 180, details: "Verified security policies, format, and accuracy" },
    { id: "response", label: "Final Response", status: "completed", duration: 100, details: "Assembled and returned production answer" }
  ];

  // Tool calls based on query content
  let toolCalls = [];
  if (isSql) {
    toolCalls = [
      {
        id: "tool_" + Math.random().toString(36).substring(2, 7),
        name: "postgres_execute_query",
        input: '{"query": "SELECT schema_name, table_name FROM information_schema.tables WHERE table_schema = \'public\'"}',
        output: '{"status": "success", "rows": [{"table_name": "users"}, {"table_name": "orders"}, {"table_name": "metrics"}]}',
        duration: 410,
        status: "completed",
        retries: 0
      },
      {
        id: "tool_" + Math.random().toString(36).substring(2, 7),
        name: "postgres_describe_table",
        input: '{"table": "metrics"}',
        output: '{"columns": [{"name": "id", "type": "uuid"}, {"name": "timestamp", "type": "timestamptz"}, {"name": "cpu_pct", "type": "float"}]}',
        duration: 340,
        status: "completed",
        retries: 0
      }
    ];
  } else if (isAws) {
    toolCalls = [
      {
        id: "tool_" + Math.random().toString(36).substring(2, 7),
        name: "aws_ecs_describe_services",
        input: '{"cluster": "agentops-prod", "services": ["auth-api"]}',
        output: '{"services": [{"serviceName": "auth-api", "status": "ACTIVE", "runningCount": 3, "desiredCount": 3}]}',
        duration: 520,
        status: "completed",
        retries: 0
      }
    ];
  } else if (isCode) {
    toolCalls = [
      {
        id: "tool_" + Math.random().toString(36).substring(2, 7),
        name: "fs_read_file",
        input: '{"path": "src/App.tsx"}',
        output: '"export default function App() { return <div>AGENTOPS Dashboard</div>; }"',
        duration: 210,
        status: "completed",
        retries: 0
      }
    ];
  } else {
    toolCalls = [
      {
        id: "tool_" + Math.random().toString(36).substring(2, 7),
        name: "google_search_grounding",
        input: JSON.stringify({ query: query }),
        output: '{"results": [{"title": "AgentOps Observability Docs", "url": "https://docs.agentops.ai", "snippet": "Monitor and trace AI agents in real time using automated open-telemetry integrations."}]}',
        duration: 720,
        status: "completed",
        retries: 0
      }
    ];
  }

  // Chronological traces
  const traces = [
    { id: "tr_1", timestamp: "00:00.050", nodeId: "user", title: "Query Ingestion", description: `Captured input query: "${query}"`, status: "completed" },
    { id: "tr_2", timestamp: "00:00.370", nodeId: "planner", title: "Plan Generation", description: `Formulated multi-step strategy: ${isSql ? "query database schema, then extract data" : isAws ? "describe ECS cluster, then compile metrics" : "search knowledge base and synthesize answer"}.`, status: "completed" },
    { id: "tr_3", timestamp: "00:00.850", nodeId: "retriever", title: "Vector Database Search", description: `Searched index for context related to "${query.substring(0, 30)}..."`, status: "completed" },
    { id: "tr_4", timestamp: "00:01.000", nodeId: "memory", title: "Episodic Recall", description: "Retrieved 3 related historical conversational sequences for persona alignment.", status: "completed" }
  ];

  toolCalls.forEach((tc, idx) => {
    traces.push({
      id: `tr_tool_${idx}`,
      timestamp: `00:01.${7 + idx * 3}`,
      nodeId: "tools",
      title: `Tool Invocated: ${tc.name}`,
      description: `Dispatched tool call with parameters: ${tc.input.substring(0, 80)}... Result received.`,
      status: "completed"
    });
  });

  traces.push(
    { id: "tr_5", timestamp: "00:02.100", nodeId: "gemini", title: "Gemini Synthesis", description: `Submitted context of size ${totalTokens} to Gemini. Drafted answer.`, status: "completed" },
    { id: "tr_6", timestamp: "00:02.280", nodeId: "validator", title: "Format & Guardrail Audit", description: "No PII or vulnerability patterns detected. Validation checks completed successfully.", status: "completed" },
    { id: "tr_7", timestamp: "00:02.380", nodeId: "response", title: "Execution Done", description: "Answer formulated and streamed to the active user session.", status: "completed" }
  );

  const memory = {
    context: `Primary context active: AgentOps Core Runtime Session. Target task: "${query}"`,
    retrievedDocs: [
      isSql ? "Table structures: users (id, name, created_at), metrics (id, system_id, val)" : "Standard API connection instructions ver 4.2",
      "Security compliance guidelines for AI tools v1.2"
    ],
    knowledgeSources: ["Internal System Architecture Vector Store", "Global Config Index"],
    memoryReferences: ["mem_ref_user_preferred_theme", "mem_ref_last_deployment_state"],
    sessionMemory: `Completed task: "${query}" successfully. Accumulated 1 tool interaction trace.`
  };

  const prompts = {
    original: query,
    expanded: `[System Instruction: You are AGENTOPS system core.]\n[Context: User requested "${query}"]. Fetch relevant documents from vector store and merge.`,
    final: `[Final Frame]\n${JSON.stringify(memory)}\n\nQuery: ${query}\nExecute instructions.`
  };

  return {
    id: sessionId,
    timestamp: timestamp,
    duration: duration,
    status: "completed",
    tokens: { input: inputTokens, output: outputTokens, total: totalTokens },
    cost: cost,
    latency: latency,
    query: query,
    nodes: nodes,
    traces: traces,
    toolCalls: toolCalls,
    prompts: prompts,
    memory: memory
  };
}

// REST API endpoint to trigger live agent execution
app.post("/api/agent/run", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Missing 'query' field." });
  }

  const ai = getGeminiClient();

  // If no Gemini client or standard fallback
  if (!ai) {
    console.log(`[AGENTOPS] No Gemini API Key or using simulation mode for prompt: "${query}"`);
    const sim = getSimulationResponse(query);
    return res.json({
      mode: "simulation",
      session: sim
    });
  }

  try {
    console.log(`[AGENTOPS] Executing Gemini query on model 'gemini-3.5-flash': "${query}"`);
    
    const prompt = `
      You are the backend generator for AGENTOPS, an advanced AI observability and trace auditing platform.
      A user has requested the following query: "${query}".
      
      Generate a highly realistic, professional, and contextually rich trace record representing the full execution of a multi-step autonomous AI agent system resolving this query.
      The output MUST fit the exact JSON schema requested.
      
      Requirements for JSON fields:
      - status: "completed" or "failed".
      - duration: random integer between 1800 and 4200 milliseconds.
      - latency: float representing duration in seconds (e.g. 1.8 to 4.2).
      - tokens: object with input (100-300), output (200-500), and total tokens.
      - cost: float cost in USD (calculated as input * 0.000000075 + output * 0.00000025).
      - nodes: Exactly 8 nodes tracking the chronological pipeline:
        1. "user": User Input (details about query)
        2. "planner": Task Planner (details of the generated plan)
        3. "retriever": RAG Retriever (details of databases queried or info looked up)
        4. "memory": Memory Sync (details of long-term memories retrieved)
        5. "tools": Tool Execution (details of specific tools run, e.g., SQL queries, API hits, Google Search)
        6. "gemini": Gemini Model (reasoning details)
        7. "validator": Validator Guard (security and formatting checks)
        8. "response": Final Response (details of final outcome)
        Ensure each node has a duration (ms), label, status ("completed", "failed", "running", or "idle") and realistic "details" text relating to the user's specific query.
      - traces: A series of 7 to 12 realistic chronological trace events with timestamps (like "00:00.120", "00:00.650") mapping to specific nodeIds.
      - toolCalls: Array of tool objects invoked during this execution. If the user asked for SQL, simulate database tools. If AWS, simulate cloud tools. Make inputs and outputs look like real professional JSON.
      - prompts: original prompt, expanded prompt (with system prompts/injected documents), and final prompt (ready for LLM inference) showcasing RAG expansion.
      - memory: detailed object including Retrieved Documents (custom text snippets matching the query), Conversation Context, Knowledge Sources, Memory References, and Session Memory.
    `;

    // Response Schema definitions as per @google/genai SDK Type system
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING },
        duration: { type: Type.INTEGER },
        latency: { type: Type.NUMBER },
        tokens: {
          type: Type.OBJECT,
          properties: {
            input: { type: Type.INTEGER },
            output: { type: Type.INTEGER },
            total: { type: Type.INTEGER }
          },
          required: ["input", "output", "total"]
        },
        cost: { type: Type.NUMBER },
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              status: { type: Type.STRING },
              duration: { type: Type.INTEGER },
              details: { type: Type.STRING }
            },
            required: ["id", "label", "status", "details"]
          }
        },
        traces: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              nodeId: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              status: { type: Type.STRING }
            },
            required: ["id", "timestamp", "nodeId", "title", "description", "status"]
          }
        },
        toolCalls: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              input: { type: Type.STRING },
              output: { type: Type.STRING },
              duration: { type: Type.INTEGER },
              status: { type: Type.STRING },
              retries: { type: Type.INTEGER },
              error: { type: Type.STRING }
            },
            required: ["id", "name", "input", "output", "duration", "status", "retries"]
          }
        },
        prompts: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            expanded: { type: Type.STRING },
            final: { type: Type.STRING }
          },
          required: ["original", "expanded", "final"]
        },
        memory: {
          type: Type.OBJECT,
          properties: {
            context: { type: Type.STRING },
            retrievedDocs: { type: Type.ARRAY, items: { type: Type.STRING } },
            knowledgeSources: { type: Type.ARRAY, items: { type: Type.STRING } },
            memoryReferences: { type: Type.ARRAY, items: { type: Type.STRING } },
            sessionMemory: { type: Type.STRING }
          },
          required: ["context", "retrievedDocs", "knowledgeSources", "memoryReferences", "sessionMemory"]
        }
      },
      required: ["status", "duration", "latency", "tokens", "cost", "nodes", "traces", "toolCalls", "prompts", "memory"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2
      }
    });

    const parsedSession = JSON.parse(response.text.trim());
    parsedSession.id = "session_" + Math.random().toString(36).substring(2, 10);
    parsedSession.timestamp = new Date().toISOString();
    parsedSession.query = query;

    return res.json({
      mode: "observability",
      session: parsedSession
    });

  } catch (error: any) {
    console.error("[AGENTOPS] Gemini query failed, falling back to local simulation:", error);
    // Graceful fallback to simulator if API fails/quota hits/error occurs
    const sim = getSimulationResponse(query);
    return res.json({
      mode: "simulation",
      fallbackError: error.message || error,
      session: sim
    });
  }
});

// Serve API check/health
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    platform: "AGENTOPS",
    geminiSupported: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"
  });
});

// Setup Vite Dev server middleware in non-production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AGENTOPS] Core Service listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
