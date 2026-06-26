import { AgentSession, SystemHealthMetrics, TokenMetrics, LatencyBreakdown, ErrorStats } from "../types";

export const INITIAL_HEALTH: SystemHealthMetrics = {
  successRate: 98.4,
  toolHealth: 99.1,
  memoryHealth: 100.0,
  avgCost: 0.000142,
  avgLatency: 2.85,
  runningSessions: 0
};

export const INITIAL_TOKENS: TokenMetrics = {
  input: 14520,
  output: 28910,
  total: 43430,
  avg: 868,
  dailyUsage: [
    { date: "06/19", input: 2100, output: 4200, total: 6300 },
    { date: "06/20", input: 1800, output: 3900, total: 5700 },
    { date: "06/21", input: 2400, output: 4800, total: 7200 },
    { date: "06/22", input: 3100, output: 5900, total: 9000 },
    { date: "06/23", input: 2900, output: 5200, total: 8100 },
    { date: "06/24", input: 3500, output: 6800, total: 10300 },
    { date: "06/25", input: 3900, output: 7800, total: 11700 }
  ],
  weeklyUsage: [
    { week: "Wk 22", input: 12000, output: 24000, total: 36000 },
    { week: "Wk 23", input: 15000, output: 29000, total: 44000 },
    { week: "Wk 24", input: 18000, output: 35000, total: 53000 },
    { week: "Wk 25", input: 22000, output: 44000, total: 66000 }
  ],
  monthlyUsage: [
    { month: "Apr", input: 62000, output: 112000, total: 174000 },
    { month: "May", input: 78000, output: 154000, total: 232000 },
    { month: "Jun", input: 91000, output: 188000, total: 279000 }
  ]
};

export const INITIAL_LATENCY: LatencyBreakdown = {
  planning: 320,
  retrieval: 450,
  toolExecution: 850,
  modelInference: 1150,
  validation: 180,
  history: [
    { timestamp: "09:00", planning: 280, retrieval: 410, tools: 750, model: 980, validation: 150 },
    { timestamp: "11:00", planning: 350, retrieval: 480, tools: 920, model: 1200, validation: 190 },
    { timestamp: "13:00", planning: 310, retrieval: 430, tools: 810, model: 1100, validation: 170 },
    { timestamp: "15:00", planning: 340, retrieval: 490, tools: 890, model: 1250, validation: 210 },
    { timestamp: "17:00", planning: 300, retrieval: 420, tools: 790, model: 1050, validation: 160 },
    { timestamp: "19:00", planning: 330, retrieval: 460, tools: 880, model: 1180, validation: 180 },
    { timestamp: "21:00", planning: 320, retrieval: 450, tools: 850, model: 1150, validation: 180 }
  ]
};

export const INITIAL_ERRORS: ErrorStats = {
  total: 12,
  failures: 4,
  retries: 8,
  timeouts: 2,
  toolErrors: 5,
  memoryErrors: 1,
  promptErrors: 0,
  recentErrors: [
    {
      id: "err_1",
      timestamp: "2026-06-25T21:10:15Z",
      category: "tool",
      message: "PostgresConnectionError: Pool exhausted (limit: 20) during catalog lookup.",
      sessionId: "session_db_8a391",
      status: "resolved"
    },
    {
      id: "err_2",
      timestamp: "2026-06-25T18:45:30Z",
      category: "network",
      message: "TimeoutError: Request to vector_index:8080 exceeded deadline of 5000ms.",
      sessionId: "session_rag_f2b90",
      status: "resolved"
    },
    {
      id: "err_3",
      timestamp: "2026-06-25T15:02:11Z",
      category: "model",
      message: "GeminiQuotaError: Rate limit exceeded for model gemini-3.5-flash (429).",
      sessionId: "session_llm_1d8ef",
      status: "ignored"
    },
    {
      id: "err_4",
      timestamp: "2026-06-25T10:11:42Z",
      category: "tool",
      message: "APIResponseError: AWS IAM validation failed for token ARN.",
      sessionId: "session_aws_9c0df",
      status: "unresolved"
    }
  ]
};

export const SEEDED_SESSIONS: AgentSession[] = [
  {
    id: "session_db_8a391",
    timestamp: "2026-06-25T21:08:42.000Z",
    duration: 3450,
    status: "completed",
    tokens: { input: 185, output: 320, total: 505 },
    cost: 0.000093,
    latency: 3.45,
    query: "Extract all active user emails with order volumes greater than $500 in May 2026",
    nodes: [
      { id: "user", label: "User Input", status: "completed", duration: 40, details: "Parsed target parameters: May 2026, threshold: $500, column: email." },
      { id: "planner", label: "Task Planner", status: "completed", duration: 380, details: "Created SQL query generation and safe execution plan." },
      { id: "retriever", label: "RAG Retriever", status: "completed", duration: 520, details: "Retrieved Postgres schema metadata for tables 'users', 'orders'." },
      { id: "memory", label: "Memory Sync", status: "completed", duration: 160, details: "Episodic memory synchronized: user prefers Postgres dialect." },
      { id: "tools", label: "Tool Execution", status: "completed", duration: 950, details: "Executed postgres_execute_query successfully (1 retry on pool error)." },
      { id: "gemini", label: "Gemini Model", status: "completed", duration: 1120, details: "Synthesized raw rows into clean client-friendly JSON structure." },
      { id: "validator", label: "Validator Guard", status: "completed", duration: 190, details: "Audited payload for SQL injection blocks and raw emails leakage." },
      { id: "response", label: "Final Response", status: "completed", duration: 90, details: "Formulated report list with 14 active user records." }
    ],
    traces: [
      { id: "tr_db_1", timestamp: "00:00.040", nodeId: "user", title: "Query parsing completed", description: "Target filtering set: May 2026, volume > 500, state = active.", status: "completed" },
      { id: "tr_db_2", timestamp: "00:00.420", nodeId: "planner", title: "SQL Plan Created", description: "Selected database target instance: prod-read-replica. Schema verification queue initialized.", status: "completed" },
      { id: "tr_db_3", timestamp: "00:00.940", nodeId: "retriever", title: "Metadata Schema Extracted", description: "Retrieved columns: users.id, users.email, orders.amount, orders.created_at.", status: "completed" },
      { id: "tr_db_4", timestamp: "00:01.100", nodeId: "memory", title: "Loaded preferences", description: "Verified user prefers compact JSON tables as report outputs.", status: "completed" },
      { id: "tr_db_5", timestamp: "00:01.420", nodeId: "tools", title: "Tool Dispatch: database_query", description: "SQL: SELECT u.email, SUM(o.amount) FROM users u JOIN orders o ON u.id = o.user_id WHERE o.created_at BETWEEN '2026-05-01' AND '2026-05-31' GROUP BY u.email HAVING SUM(o.amount) > 500", status: "completed" },
      { id: "tr_db_6", timestamp: "00:02.050", nodeId: "tools", title: "Database Exception Caught", description: "Database connection pool exhausted. Retrying connection in 200ms...", status: "failed" },
      { id: "tr_db_7", timestamp: "00:02.370", nodeId: "tools", title: "Query execution succeeded", description: "Returned 14 rows matching threshold filters.", status: "completed" },
      { id: "tr_db_8", timestamp: "00:03.170", nodeId: "gemini", title: "Gemini response synthesis", description: "Generated a beautifully formatted table representing the cohort email list.", status: "completed" },
      { id: "tr_db_9", timestamp: "00:03.360", nodeId: "validator", title: "Guardrails checked", description: "No PII restrictions violated. Verified correct ordering format.", status: "completed" },
      { id: "tr_db_10", timestamp: "00:03.450", nodeId: "response", title: "Session Completed", description: "Piped formatted dataset to active dashboard.", status: "completed" }
    ],
    toolCalls: [
      {
        id: "tc_db_1",
        name: "postgres_execute_query",
        input: '{"query": "SELECT u.email, SUM(o.amount) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.email HAVING SUM(o.amount) > 500"}',
        output: '{"status": "success", "rows": [{"email": "dev1@test.com", "total": 1250.0}, {"email": "exec3@corp.org", "total": 620.45}]}',
        duration: 950,
        status: "completed",
        retries: 1,
        error: "Connection pool limit reached (20)"
      }
    ],
    prompts: {
      original: "Extract all active user emails with order volumes greater than $500 in May 2026",
      expanded: "Context: Active Postgres client. Schema: Users and Orders. Task: Generate SQL to compile emails and order sums. Perform schema check first.",
      final: "Execute query generation against Postgres schema. Schema: users(id, email), orders(id, user_id, amount, created_at). Format: email, volume."
    },
    memory: {
      context: "User session: db-reporting. Scope: May 2026 sales audit.",
      retrievedDocs: [
        "Database catalog: schema definitions for sales ledger",
        "Config policy: user emails must only be accessible under active admin authentication"
      ],
      knowledgeSources: ["Postgres Production Schema Catalog"],
      memoryReferences: ["mem_db_connection_credentials", "mem_user_reporting_cohort"],
      sessionMemory: "Extracted 14 emails representing May 2026 power cohort. User noted the connection pool delay."
    }
  },
  {
    id: "session_aws_9c0df",
    timestamp: "2026-06-25T10:08:15.000Z",
    duration: 4120,
    status: "failed",
    tokens: { input: 240, output: 85, total: 325 },
    cost: 0.000039,
    latency: 4.12,
    query: "Reboot ECS auth-api container tasks inside AWS clusters",
    nodes: [
      { id: "user", label: "User Input", status: "completed", duration: 50, details: "Parsed target service: auth-api." },
      { id: "planner", label: "Task Planner", status: "completed", duration: 420, details: "Formulated safe cluster restart sequence." },
      { id: "retriever", label: "RAG Retriever", status: "completed", duration: 610, details: "Retrieved cluster configurations for AWS environment." },
      { id: "memory", label: "Memory Sync", status: "completed", duration: 190, details: "Loaded AWS credentials and cluster profiles." },
      { id: "tools", label: "Tool Execution", status: "failed", duration: 2100, details: "Dispatched AWS commands. Returned authorization failure." },
      { id: "gemini", label: "Gemini Model", status: "idle", details: "Awaiting valid execution status." },
      { id: "validator", label: "Validator Guard", status: "idle", details: "Pipeline halted due to upstream failure." },
      { id: "response", label: "Final Response", status: "failed", duration: 100, details: "Halted execution. Displayed cluster authentication error." }
    ],
    traces: [
      { id: "tr_aws_1", timestamp: "00:00.050", nodeId: "user", title: "Target Service Defined", description: "Parsed target: serviceName='auth-api', region='us-west-2'.", status: "completed" },
      { id: "tr_aws_2", timestamp: "00:00.470", nodeId: "planner", title: "Formulating Command", description: "Action determined: aws ecs update-service --force-new-deployment.", status: "completed" },
      { id: "tr_aws_3", timestamp: "00:01.080", nodeId: "retriever", title: "Profile configuration resolved", description: "Resolved cluster identifier: arn:aws:ecs:us-west-2:983125:cluster/agentops-prod.", status: "completed" },
      { id: "tr_aws_4", timestamp: "00:01.270", nodeId: "memory", title: "Access Key active", description: "Verified secret key AWS_ACCESS_KEY_ID exists in current runtime env.", status: "completed" },
      { id: "tr_aws_5", timestamp: "00:01.520", nodeId: "tools", title: "Tool Call: AWS CLI Dispatch", description: "Command: aws ecs update-service --cluster agentops-prod --service auth-api --force-new-deployment", status: "running" },
      { id: "tr_aws_6", timestamp: "00:03.370", nodeId: "tools", title: "AWS Credentials Refused", description: "Error code: AccessDeniedException. Task: ecs:UpdateService has been refused on target cluster.", status: "failed" },
      { id: "tr_aws_7", timestamp: "00:04.020", nodeId: "response", title: "Pipeline Crash", description: "Aborting run due to insufficient AWS IAM permissions. Prompted developer adjustment.", status: "failed" }
    ],
    toolCalls: [
      {
        id: "tc_aws_1",
        name: "aws_ecs_update_service",
        input: '{"cluster": "agentops-prod", "service": "auth-api", "forceNewDeployment": true}',
        output: '{"error": "AccessDeniedException", "message": "User: arn:aws:iam::983125:user/agentops-runner is not authorized to perform: ecs:UpdateService"}',
        duration: 1850,
        status: "failed",
        retries: 0,
        error: "AWS IAM validation failed for token ARN."
      }
    ],
    prompts: {
      original: "Reboot ECS auth-api container tasks inside AWS clusters",
      expanded: "Context: AWS deployment coordinator. Target: Us-west-2 ECS engine. Run force-new-deployment on ECS services named 'auth-api'. Check permissions first.",
      final: "Send deployment request to Amazon ECS endpoints. Cluster: agentops-prod, Service: auth-api. Force: True."
    },
    memory: {
      context: "User environment: AWS cluster-management console profile.",
      retrievedDocs: [
        "AWS policy guide on force ECS restarts",
        "Cluster roster: agentops-prod (active), proxy-dev (offline)"
      ],
      knowledgeSources: ["Cluster IAM Policy Matrix"],
      memoryReferences: ["mem_aws_access_token_arn"],
      sessionMemory: "Task failed. Blocked on IAM permissions: ecs:UpdateService. User notified to review auth role."
    }
  },
  {
    id: "session_rag_f2b90",
    timestamp: "2026-06-24T18:42:00.000Z",
    duration: 2150,
    status: "completed",
    tokens: { input: 110, output: 185, total: 295 },
    cost: 0.000054,
    latency: 2.15,
    query: "Find documentation on setting up local SSL proxy with docker-compose",
    nodes: [
      { id: "user", label: "User Input", status: "completed", duration: 30, details: "Query captured: 'SSL proxy docker-compose'." },
      { id: "planner", label: "Task Planner", status: "completed", duration: 250, details: "Formulated search query terms: local SSL proxy docker Caddy Nginx." },
      { id: "retriever", label: "RAG Retriever", status: "completed", duration: 310, details: "Queried AgentOps vector databases. Extracted 2 files." },
      { id: "memory", label: "Memory Sync", status: "completed", duration: 110, details: "Recalled previous search on Caddy reverse proxies." },
      { id: "tools", label: "Tool Execution", status: "completed", duration: 420, details: "Queried internal search index." },
      { id: "gemini", label: "Gemini Model", status: "completed", duration: 810, details: "Generated elegant markdown instructions." },
      { id: "validator", label: "Validator Guard", status: "completed", duration: 140, details: "Parsed compose YAML syntax block for validation." },
      { id: "response", label: "Final Response", status: "completed", duration: 80, details: "Rendered steps for local proxy deployment." }
    ],
    traces: [
      { id: "tr_rag_1", timestamp: "00:00.030", nodeId: "user", title: "Input sanitized", description: "Parsed keyword vectors for Docker and SSL.", status: "completed" },
      { id: "tr_rag_2", timestamp: "00:00.280", nodeId: "planner", title: "Selected strategy", description: "Plan: search local index for Nginx/Caddy recipes, evaluate Docker volumes setup.", status: "completed" },
      { id: "tr_rag_3", timestamp: "00:00.590", nodeId: "retriever", title: "Vector records returned", description: "Hit 2 documents: 'Caddy Proxy Template' and 'Local SSL certs setup'.", status: "completed" },
      { id: "tr_rag_4", timestamp: "00:00.700", nodeId: "memory", title: "Reused context", description: "Context active: user develops using Next.js on localhost:3000.", status: "completed" },
      { id: "tr_rag_5", timestamp: "00:01.120", nodeId: "tools", title: "Query Local Index Docs", description: "Dispatched document lookup on Caddy proxy configurations.", status: "completed" },
      { id: "tr_rag_6", timestamp: "00:01.930", nodeId: "gemini", title: "Instructions generated", description: "Formulated 3-tier setup with mkcert certificates and multi-container networking.", status: "completed" },
      { id: "tr_rag_7", timestamp: "00:02.070", nodeId: "validator", title: "Syntax Check Green", description: "Ensured correct placement of volumes and environment files in YAML.", status: "completed" },
      { id: "tr_rag_8", timestamp: "00:02.150", nodeId: "response", title: "Trace Completed", description: "Delivered recipe details to user UI.", status: "completed" }
    ],
    toolCalls: [
      {
        id: "tc_rag_1",
        name: "index_lookup",
        input: '{"query": "docker compose ssl reverse proxy Nginx Caddy"}',
        output: '{"status": "success", "hits": ["docs/networking/local-ssl-proxy.md"]}',
        duration: 420,
        status: "completed",
        retries: 0
      }
    ],
    prompts: {
      original: "Find documentation on setting up local SSL proxy with docker-compose",
      expanded: "Context: Devops developer guide. Target: SSL local setup. Extract Caddy and mkcert recipes from technical repository index.",
      final: "Compile a secure, functional docker-compose.yml configuration with Caddy acting as reverse proxy for an internal app running on port 3000."
    },
    memory: {
      context: "User environment: macOS dev environment with Docker Desktop.",
      retrievedDocs: [
        "Docker networking guide for localhost aliases",
        "Nginx reverse proxy sample with certificates"
      ],
      knowledgeSources: ["DevOps Knowledge Wiki Vector Database"],
      memoryReferences: ["mem_docker_network_mode"],
      sessionMemory: "Delivered local SSL recipe successfully. User marked Nginx config as reference."
    }
  }
];
