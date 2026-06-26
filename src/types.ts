export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface NodeState {
  id: 'user' | 'planner' | 'retriever' | 'memory' | 'tools' | 'gemini' | 'validator' | 'response';
  label: string;
  status: NodeStatus;
  duration?: number; // in ms
  details?: string;
}

export interface TraceEvent {
  id: string;
  timestamp: string; // HH:MM:SS.mmm
  nodeId: string;
  title: string;
  description: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
  metadata?: Record<string, any>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: string;
  output: string;
  duration: number; // ms
  status: 'completed' | 'failed';
  retries: number;
  error?: string;
}

export interface AgentSession {
  id: string;
  timestamp: string; // ISO string
  duration: number; // total ms
  status: 'completed' | 'failed' | 'running';
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  cost: number; // in USD
  latency: number; // in s
  query: string;
  nodes: NodeState[];
  traces: TraceEvent[];
  toolCalls: ToolCall[];
  prompts: {
    original: string;
    expanded: string;
    final: string;
  };
  memory: {
    context: string;
    retrievedDocs: string[];
    knowledgeSources: string[];
    memoryReferences: string[];
    sessionMemory: string;
  };
}

export interface SystemHealthMetrics {
  successRate: number; // %
  toolHealth: number; // %
  memoryHealth: number; // %
  avgCost: number; // USD
  avgLatency: number; // s
  runningSessions: number;
}

export interface TokenMetrics {
  input: number;
  output: number;
  total: number;
  avg: number;
  dailyUsage: { date: string; input: number; output: number; total: number }[];
  weeklyUsage: { week: string; input: number; output: number; total: number }[];
  monthlyUsage: { month: string; input: number; output: number; total: number }[];
}

export interface LatencyBreakdown {
  planning: number; // ms
  retrieval: number; // ms
  toolExecution: number; // ms
  modelInference: number; // ms
  validation: number; // ms
  history: { timestamp: string; planning: number; retrieval: number; tools: number; model: number; validation: number }[];
}

export interface ErrorStats {
  total: number;
  failures: number;
  retries: number;
  timeouts: number;
  toolErrors: number;
  memoryErrors: number;
  promptErrors: number;
  recentErrors: {
    id: string;
    timestamp: string;
    category: 'tool' | 'memory' | 'prompt' | 'model' | 'network';
    message: string;
    sessionId: string;
    status: 'resolved' | 'unresolved' | 'ignored';
  }[];
}
