import React, { useState } from "react";
import { 
  GitCommit, 
  ChevronDown, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Activity,
  ArrowDown,
  Terminal,
  Cpu,
  Database,
  Search,
  Eye,
  Workflow,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react";
import { AgentSession } from "../types";

interface TracesViewProps {
  sessions: AgentSession[];
  selectedSession: AgentSession | null;
}

export default function TracesView({ sessions, selectedSession }: TracesViewProps) {
  const activeSession = selectedSession || sessions[0];
  const [selectedSpanId, setSelectedSpanId] = useState<string>("span_planner");

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0B0F14] text-gray-500 text-center font-mono">
        <Activity className="h-10 w-10 text-gray-800 mb-3 animate-pulse" />
        <p className="text-xs">No active telemetry sessions logged in database buffers.</p>
      </div>
    );
  }

  // Feature 6 — Nested Span Data Structure representation
  const spans = [
    {
      id: "span_planner",
      name: "agent_planner_orchestrate",
      service: "Strategy Planner",
      startMs: 0,
      durationMs: 320,
      depth: 0,
      status: "completed",
      model: "gemini-3.5-flash",
      tool: "none",
      memoryAccess: "Read Cache [Hit]",
      input: `{ "query": "${activeSession.query}" }`,
      output: `{ "plan": ["retrieve_docs", "postgres_execute", "validate_output"], "confidence": 0.98 }`
    },
    {
      id: "span_retriever",
      name: "vector_index_search",
      service: "Semantic Indexer",
      startMs: 320,
      durationMs: 280,
      depth: 1,
      status: "completed",
      model: "none",
      tool: "vector_index_search",
      memoryAccess: "Read Semantic Embeddings",
      input: `{ "embedding_vector": [0.12, -0.42, 0.89, ...], "top_k": 3 }`,
      output: `{ "matched_chunks_count": 3, "average_similarity": 0.8942 }`
    },
    {
      id: "span_tool",
      name: activeSession.query.match(/aws|reboot/i) ? "aws_ecs_update_service" : "postgres_execute_query",
      service: activeSession.query.match(/aws|reboot/i) ? "DevOps Coordinator" : "Postgres Specialist",
      startMs: 600,
      durationMs: activeSession.query.match(/aws|reboot/i) ? 610 : 450,
      depth: 1,
      status: activeSession.query.match(/aws|reboot/i) ? "failed" : "completed",
      model: "none",
      tool: activeSession.query.match(/aws|reboot/i) ? "aws_ecs_update_service" : "postgres_execute_query",
      memoryAccess: "Read/Write Transaction Context",
      input: activeSession.query.match(/aws|reboot/i) 
        ? `{ "cluster": "production-microservices", "service": "auth-service", "desiredCount": 1 }`
        : `{ "sql": "SELECT id, name, status, created_at FROM orders ORDER BY created_at DESC LIMIT 5;" }`,
      output: activeSession.query.match(/aws|reboot/i)
        ? `{ "error": "AccessDeniedException: IAM Role not authorized", "code": 403 }`
        : `{ "rows": 5, "duration_ms": 4.2 }`
    },
    {
      id: "span_model",
      name: "gemini_inference_generation",
      service: "Gemini Orchestrator",
      startMs: 1050,
      durationMs: 1100,
      depth: 1,
      status: activeSession.query.match(/aws|reboot/i) ? "failed" : "completed",
      model: "gemini-3.5-flash",
      tool: "none",
      memoryAccess: "Read/Write Session Profile Graph",
      input: `{ "prompt": "Construct output context summarizing database queries", "tokens": 1420 }`,
      output: activeSession.query.match(/aws|reboot/i)
        ? `{ "error": "Pipeline execution aborted due to preceding component failure." }`
        : `{ "response": "Orders fetched successfully. Total sales amount is $4,821.", "tokens": 382 }`
    },
    {
      id: "span_validator",
      name: "payload_validator_guard",
      service: "Compliance Guard",
      startMs: 2150,
      durationMs: 180,
      depth: 1,
      status: activeSession.query.match(/aws|reboot/i) ? "failed" : "completed",
      model: "none",
      tool: "payload_validator_guard",
      memoryAccess: "None",
      input: `{ "content": "Orders fetched successfully..." }`,
      output: `{ "integrity": "match", "safety": "passed", "action": "allow" }`
    }
  ];

  const totalTimeMs = spans[spans.length - 1].startMs + spans[spans.length - 1].durationMs;
  const selectedSpan = spans.find(s => s.id === selectedSpanId) || spans[0];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-6 font-sans">
      
      {/* View Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            DISTRIBUTED TRACING
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">Distributed Trace View</h2>
          <p className="text-xs text-gray-400 mt-1">
            Analyzing parent-child span hierarchy for execution ID: <span className="font-mono text-blue-400 font-semibold">{activeSession.id}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-gray-400 bg-gray-900 border border-gray-800 px-3 py-1 rounded">
          <span>Active Session Tracer</span>
        </div>
      </div>

      {/* Hero Session Summary card */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-mono text-gray-500 uppercase">Target Query Context</span>
          <p className="text-sm font-semibold text-white leading-relaxed">"{activeSession.query}"</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-xs font-mono">
          <div>
            <span className="text-gray-500 block text-[9px] uppercase">Trace Spans</span>
            <span className="text-white font-bold">5 segments</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[9px] uppercase">Latency Budget</span>
            <span className="text-blue-400 font-bold">{totalTimeMs}ms</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[9px] uppercase">Pipeline Status</span>
            <span className={`font-semibold ${activeSession.status === "completed" ? "text-emerald-400" : "text-red-400"}`}>
              {activeSession.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Nested Flame/Span Chart */}
        <div className="lg:col-span-7 bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Spans Timeline</h3>
            <span className="text-[10px] font-mono text-gray-500">Total duration: {totalTimeMs}ms</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* Horizontal Timeline scale ticks */}
            <div className="flex justify-between text-[10px] font-mono text-gray-500 border-b border-gray-850 pb-1 select-none">
              <span>0ms</span>
              <span>500ms</span>
              <span>1000ms</span>
              <span>1500ms</span>
              <span>2000ms</span>
              <span>{totalTimeMs}ms</span>
            </div>

            {/* Span Blocks List */}
            <div className="space-y-3">
              {spans.map((span) => {
                const percentageStart = (span.startMs / totalTimeMs) * 100;
                const percentageWidth = (span.durationMs / totalTimeMs) * 100;
                const isSelected = selectedSpanId === span.id;
                
                return (
                  <div 
                    key={span.id} 
                    onClick={() => setSelectedSpanId(span.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all space-y-2 ${
                      isSelected 
                        ? "bg-blue-950/20 border-blue-500/80" 
                        : "bg-gray-950/25 border-gray-850 hover:border-gray-700"
                    }`}
                  >
                    {/* Span Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Indentation for depth */}
                        {span.depth > 0 && <ChevronRight className="h-3 w-3 text-gray-600 ml-2" />}
                        <span className="font-mono text-xs font-semibold text-white">{span.name}</span>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">({span.service})</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-gray-400">{span.durationMs}ms</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          span.status === "completed" ? "bg-emerald-500" : "bg-red-500 animate-pulse"
                        }`}></span>
                      </div>
                    </div>

                    {/* Miniature horizontal bar span visual */}
                    <div className="w-full bg-gray-900/40 h-2.5 rounded-full relative overflow-hidden border border-gray-850">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          span.status === "completed" 
                            ? isSelected ? "bg-blue-500" : "bg-indigo-500/75" 
                            : "bg-red-500"
                        }`}
                        style={{ 
                          marginLeft: `${percentageStart}%`, 
                          width: `${Math.max(percentageWidth, 3)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Span Payload & Telemetry Inspector */}
        <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-5 text-left sticky top-4">
          <div className="flex items-center gap-2 border-b border-gray-850 pb-4">
            <Layers className="h-4 w-4 text-blue-400" />
            <div>
              <h4 className="text-xs font-semibold text-white uppercase font-mono">Span Inspector</h4>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: {selectedSpan.id}</p>
            </div>
          </div>

          {/* Span Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-gray-950 p-2.5 rounded border border-gray-850 space-y-0.5">
              <span className="text-gray-500 block text-[9px] uppercase">Service Name</span>
              <span className="text-white font-semibold">{selectedSpan.service}</span>
            </div>
            <div className="bg-gray-950 p-2.5 rounded border border-gray-850 space-y-0.5">
              <span className="text-gray-500 block text-[9px] uppercase">Latency Spanned</span>
              <span className="text-blue-400 font-bold font-mono">{selectedSpan.durationMs}ms</span>
            </div>
            <div className="bg-gray-950 p-2.5 rounded border border-gray-850 space-y-0.5">
              <span className="text-gray-500 block text-[9px] uppercase">Executing Model</span>
              <span className="text-gray-300 font-semibold">{selectedSpan.model}</span>
            </div>
            <div className="bg-gray-950 p-2.5 rounded border border-gray-850 space-y-0.5">
              <span className="text-gray-500 block text-[9px] uppercase">Ecosystem Tool</span>
              <span className="text-indigo-400 font-bold font-mono truncate block">{selectedSpan.tool}</span>
            </div>
            <div className="bg-gray-950 p-2.5 rounded border border-gray-850 space-y-0.5 col-span-2">
              <span className="text-gray-500 block text-[9px] uppercase">Memory State Operations</span>
              <span className="text-purple-400 font-semibold">{selectedSpan.memoryAccess}</span>
            </div>
          </div>

          {/* Payloads */}
          <div className="space-y-4 pt-2 border-t border-gray-850 text-xs font-mono">
            <div className="space-y-1.5">
              <span className="text-gray-500 text-[10px] uppercase">Span Input payload:</span>
              <pre className="bg-gray-950 p-3 rounded-lg border border-gray-850 overflow-x-auto text-blue-300 text-[11px] max-h-40 leading-relaxed">
                {selectedSpan.input}
              </pre>
            </div>
            <div className="space-y-1.5">
              <span className="text-gray-500 text-[10px] uppercase">Span Output payload:</span>
              <pre className="bg-gray-950 p-3 rounded-lg border border-gray-850 overflow-x-auto text-emerald-300 text-[11px] max-h-40 leading-relaxed">
                {selectedSpan.output}
              </pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
