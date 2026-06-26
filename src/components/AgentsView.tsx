import React from "react";
import { 
  Cpu, 
  Settings2, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  GitBranch, 
  Compass, 
  CloudLightning 
} from "lucide-react";

export default function AgentsView() {
  
  const agents = [
    {
      id: "agent_planner",
      name: "Strategy & Task Planner",
      model: "gemini-3.5-flash",
      role: "Orchestration & Decomposition",
      focus: "Decomposes complex human statements into logical execution steps, coordinates tool routing and defines validation criteria.",
      health: 99.4,
      avgLatency: 320,
      runs: 1420,
      tokens: 4120,
      memoryUsage: 14.5,
      status: "idle",
      step: "Awaiting next prompt trigger",
      icon: Compass,
      color: "text-blue-400 border-blue-900/30 bg-blue-950/20"
    },
    {
      id: "agent_sql",
      name: "Postgres Database Specialist",
      model: "gemini-3.5-flash",
      role: "DML/SQL Execution & Schema Audit",
      focus: "Analyzes system metadata schemas, formulates optimized PostgreSQL queries, evaluates query security parameters, and processes rows into JSON.",
      health: 98.1,
      avgLatency: 450,
      runs: 852,
      tokens: 8940,
      memoryUsage: 38.2,
      status: "running",
      step: "Executing index analysis query",
      icon: Database,
      color: "text-indigo-400 border-indigo-900/30 bg-indigo-950/20"
    },
    {
      id: "agent_devops",
      name: "AWS DevOps Coordinator",
      model: "gemini-3.5-flash",
      role: "Cloud Resource Operations",
      focus: "Manages server reboots, describes ECS containers, processes VPC cluster metrics, and synchronizes IAM tokens.",
      health: 94.2,
      avgLatency: 610,
      runs: 312,
      tokens: 15400,
      memoryUsage: 64.1,
      status: "recovering",
      step: "Retrying IAM assume-role credentials handshake",
      icon: CloudLightning,
      color: "text-amber-400 border-amber-900/30 bg-amber-950/20"
    },
    {
      id: "agent_retriever",
      name: "Semantic Retrieval Indexer",
      model: "gemini-3.5-flash",
      role: "RAG & Knowledge Lookup",
      focus: "Queries vector database indices, ranks relevant chunks based on cosine similarity, formats reference contexts and updates memory buffers.",
      health: 100.0,
      avgLatency: 280,
      runs: 2450,
      tokens: 1800,
      memoryUsage: 12.8,
      status: "completed",
      step: "Awaiting retrieval request",
      icon: Settings2,
      color: "text-teal-400 border-teal-900/30 bg-teal-950/20"
    },
    {
      id: "agent_critic",
      name: "Prompt Critic & Refiner",
      model: "gemini-3.5-flash",
      role: "Self-Correction & Refinement",
      focus: "Evaluates intermediate generation layers, audits response alignment, refines output prompts, and enforces semantic guidelines.",
      health: 97.6,
      avgLatency: 490,
      runs: 942,
      tokens: 3100,
      memoryUsage: 22.4,
      status: "idle",
      step: "Awaiting critic evaluation",
      icon: Cpu,
      color: "text-purple-400 border-purple-900/30 bg-purple-950/20"
    },
    {
      id: "agent_validator",
      name: "Guardrails Safety Validator",
      model: "gemini-3.5-flash",
      role: "Output Safety Compliance",
      focus: "Scans compiled output against safety filters, prevents prompt-injection loops, checks PII disclosure limits and structural formatting integrity.",
      health: 99.8,
      avgLatency: 190,
      runs: 2100,
      tokens: 950,
      memoryUsage: 8.4,
      status: "idle",
      step: "Compliance monitor active",
      icon: Terminal,
      color: "text-rose-400 border-rose-900/35 bg-rose-950/20"
    }
  ];

  // Health summary metrics for cards (FEATURE 4)
  const healthCards = [
    { title: "Strategic Planner", status: "Healthy", successRate: 99.4, avgRuntime: "320ms", errorRate: 0.6, lastExecution: "2s ago", bg: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" },
    { title: "Postgres Specialist", status: "Warning", successRate: 98.1, avgRuntime: "450ms", errorRate: 1.9, lastExecution: "15s ago", bg: "bg-amber-950/20 border-amber-900/35 text-amber-400" },
    { title: "DevOps Coordinator", status: "Recovering", successRate: 94.2, avgRuntime: "610ms", errorRate: 5.8, lastExecution: "1m ago", bg: "bg-blue-950/20 border-blue-900/35 text-blue-400" },
    { title: "Semantic Indexer", status: "Healthy", successRate: 100.0, avgRuntime: "280ms", errorRate: 0.0, lastExecution: "30s ago", bg: "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            AGENT REGISTRY
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">Registered Autonomous Agents</h2>
          <p className="text-xs text-gray-400 mt-1">
            Directory of configured agent systems executing within active pipeline sandboxes.
          </p>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-gray-900 px-3 py-1.5 rounded border border-gray-800">
          <span>Active Agents: 6 / 6</span>
        </div>
      </div>

      {/* Feature 4 — AGENT HEALTH MONITOR Cards */}
      <div className="space-y-3.5 text-left">
        <h3 className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Pipeline Health Monitor</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthCards.map((hc, idx) => (
            <div key={idx} className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-display">{hc.title}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono uppercase ${hc.bg}`}>
                  {hc.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 pt-1 border-t border-gray-850">
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Success Rate</span>
                  <span className="text-white font-semibold">{hc.successRate}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Avg Latency</span>
                  <span className="text-blue-400 font-semibold">{hc.avgRuntime}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Error Rate</span>
                  <span className="text-red-400 font-semibold">{hc.errorRate}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Last Executed</span>
                  <span className="text-gray-300 font-semibold">{hc.lastExecution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Agent Cards */}
      <div className="space-y-3.5 text-left pt-2">
        <h3 className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Active Agent Orchestrations</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="bg-[#111827] border border-gray-800 hover:border-gray-700 transition-all rounded-xl p-6 flex flex-col justify-between space-y-5 shadow-sm group">
              
              {/* Header inside card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-lg border ${agent.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display group-hover:text-blue-400 transition-colors">{agent.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{agent.id}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 border px-2 py-0.5 rounded ${
                  agent.status === "running" ? "bg-blue-950/20 border-blue-900/40 text-blue-400" :
                  agent.status === "recovering" ? "bg-amber-950/20 border-amber-900/30 text-amber-400 animate-pulse" :
                  agent.status === "completed" ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400" :
                  "bg-gray-900 border-gray-800 text-gray-400"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    agent.status === "running" ? "bg-blue-500 animate-pulse" :
                    agent.status === "recovering" ? "bg-amber-500 animate-pulse" :
                    agent.status === "completed" ? "bg-emerald-500" : "bg-gray-600"
                  }`}></span>
                  <span className="text-[9px] font-mono uppercase">{agent.status}</span>
                </div>
              </div>

              {/* Focus & Active Step */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">Operational Focus</span>
                  <p className="text-gray-300 leading-relaxed font-sans">{agent.focus}</p>
                </div>
                <div className="p-2.5 bg-gray-950 rounded border border-gray-850 flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-blue-400 font-bold">STEP:</span>
                  <span className="text-gray-400">{agent.step}</span>
                </div>
              </div>

              {/* Metadata Stats */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-800/60 text-[10px] font-mono">
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Backing Model</span>
                  <span className="text-gray-200 font-semibold truncate block">{agent.model}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Node Health</span>
                  <span className="text-emerald-400 font-bold">{agent.health}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Tokens</span>
                  <span className="text-indigo-400 font-bold">{agent.tokens}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[8px] uppercase">Memory</span>
                  <span className="text-blue-400 font-bold">{agent.memoryUsage}MB</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
      </div>

    </div>
  );
}
