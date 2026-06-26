import React, { useState } from "react";
import { 
  HelpCircle, 
  Layers, 
  GitCommit, 
  Play, 
  Database, 
  Clock, 
  Coins, 
  FileInput, 
  Settings2, 
  BookOpen, 
  Cpu, 
  Search, 
  CheckCircle2, 
  Lightbulb, 
  Compass,
  ArrowRight
} from "lucide-react";

export default function HelpView() {
  const [activeTab, setActiveTab] = useState<"all" | "core" | "resources" | "optimizations">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const docs = [
    {
      id: "sessions",
      category: "core",
      title: "Agent Sessions",
      icon: Cpu,
      iconColor: "text-blue-400 border-blue-900/30 bg-blue-950/20",
      description: "An Agent Session represents a single, complete execution cycle of an AI agent. It tracks everything from the user's initial natural language intent to the final system output.",
      details: [
        "Tracks token metrics, pricing index, and duration constraints.",
        "Captures complete execution flow across multiple modular pipeline nodes.",
        "Serves as the high-level parent wrapper for nested traces and step telemetry."
      ],
      tip: "Use sessions to isolate and inspect the exact environmental variables of each distinct run."
    },
    {
      id: "tracing",
      category: "core",
      title: "Distributed Tracing",
      icon: Layers,
      iconColor: "text-indigo-400 border-indigo-900/30 bg-indigo-950/20",
      description: "Distributed Tracing decomposes single agent executions into discrete, parent-child span hierarchies, mapping out execution times for planning, retrieval, tools, and inference.",
      details: [
        "Visualizes exact critical-path bottlenecks using micro-gantt charts.",
        "Logs precise millisecond latency breakdowns for granular auditing.",
        "Details component input and output payloads with state comparisons."
      ],
      tip: "Select a trace span block to reveal the exact raw prompt context fed to the model."
    },
    {
      id: "replay",
      category: "core",
      title: "Interactive Replays",
      icon: Play,
      iconColor: "text-emerald-400 border-emerald-900/30 bg-emerald-950/20",
      description: "Replaying a session lets you re-trigger and run preceding steps on recorded parameters to review response deviations or debug tool failures under identical conditions.",
      details: [
        "Locks down random seeds, temperatures, and dynamic API states.",
        "Allows direct state comparison of historical output versus new inference.",
        "Provides hot-swapping options for prompts and system rules."
      ],
      tip: "Replays are perfect for regression testing when fine-tuning prompts or code instructions."
    },
    {
      id: "memory",
      category: "resources",
      title: "Episodic Memory Snapshots",
      icon: Database,
      iconColor: "text-purple-400 border-purple-900/30 bg-purple-950/20",
      description: "Memory snapshots audit dynamic conversation contexts, matched vector chunks, and persistent memory graph changes stored across multiple distinct user interactions.",
      details: [
        "Visualizes retrieved semantic documents and their matching similarity metrics.",
        "Details updated memory registers written back to the persistent store.",
        "Audits active conversational history frame bounds."
      ],
      tip: "Inspect memory snapshots to check if the agent is fetching correct RAG context chunks."
    },
    {
      id: "latency",
      category: "resources",
      title: "Latency Budgets",
      icon: Clock,
      iconColor: "text-amber-400 border-amber-900/30 bg-amber-950/20",
      description: "Latency budgets define target completion limits for different modular pipeline nodes. Any node exceeding limits raises a latency budget exception.",
      details: [
        "Sets 500ms bounds on planning steps and vector index queries.",
        "Monitors synchronous third-party API tool calls on a 1500ms deadline.",
        "Tracks historical latency curves across continuous evaluation loops."
      ],
      tip: "Isolate long latency spikes to determine if the issue is a slow API tool or inference lag."
    },
    {
      id: "cost",
      category: "resources",
      title: "Compute Spend Index",
      icon: Coins,
      iconColor: "text-teal-400 border-teal-900/30 bg-teal-950/20",
      description: "Spend analysis tracks prompt and completion tokens multiplied by backing LLM pricing vectors to calculate real-time transaction-level operating budgets.",
      details: [
        "Calculates individual execution costs down to 6 decimal places.",
        "Charts daily cost distributions compared to target budget caps.",
        "Exposes hidden spenders by ranking system instruction and tool token payloads."
      ],
      tip: "Enable prompt-caching configurations to compress repeating instruction token costs."
    },
    {
      id: "prompt_inspector",
      category: "optimizations",
      title: "Prompt Pipeline",
      icon: FileInput,
      iconColor: "text-rose-400 border-rose-900/30 bg-rose-950/20",
      description: "The Prompt Inspector tracks prompt hydration layers—showing how raw user queries are compiled with system instructions and active semantic memories.",
      details: [
        "Compares raw input queries side-by-side with full system instructions.",
        "Details hydration of RAG memory contexts before model inference.",
        "Isolates dynamic few-shot examples injected during orchestration."
      ],
      tip: "Audit final compiled prompts to verify safety guidelines and instruction compliance."
    },
    {
      id: "tool_calls",
      category: "optimizations",
      title: "Tool Execution Integrations",
      icon: Settings2,
      iconColor: "text-cyan-400 border-cyan-900/30 bg-cyan-950/20",
      description: "Tools allow agents to read from databases, invoke container routines, or dispatch web-hooks. Tool execution monitors inputs, outputs, and retries.",
      details: [
        "Tracks database SQL queries, arguments, and total record counts.",
        "Logs external webhook triggers with HTTP headers and status codes.",
        "Records retry loops and failure states under network lag or permission checks."
      ],
      tip: "Combine tool logs with Failure Diagnostics to auto-diagnose API token or permission errors."
    }
  ];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || doc.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            AGENT KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl font-bold font-display text-white mt-2">Help & Documentation Center</h2>
          <p className="text-sm text-gray-400 mt-1">
            Understand the core architecture, tracing standards, and resource allocations of AGENTOPS.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#111827] rounded-lg border border-gray-850 p-0.5 font-mono text-xs select-none">
            {(["all", "core", "resources", "optimizations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-bold tracking-wider transition-all ${
                  activeTab === tab 
                    ? "bg-blue-600 text-white shadow" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global search within documentation */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search through documentation (e.g. RAG context, budgets, replays...)"
          className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-sans text-gray-200 shadow-inner placeholder-gray-500"
        />
      </div>

      {/* Grid: Bento style Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div 
              key={doc.id}
              className="bg-[#111827]/80 border border-gray-800 hover:border-gray-700 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 text-left group"
            >
              <div className="space-y-4">
                {/* Title & Icon Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border transition-all duration-300 ${doc.iconColor} group-hover:scale-110`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-white group-hover:text-blue-400 transition-colors">
                      {doc.title}
                    </h3>
                    <span className="text-[9px] font-mono text-gray-500 uppercase font-semibold">
                      ID: {doc.id} • CLASS: {doc.category}
                    </span>
                  </div>
                </div>

                {/* Main description */}
                <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                  {doc.description}
                </p>

                {/* Sub features bullet items */}
                <div className="space-y-2 pt-1 border-t border-gray-800/40">
                  {doc.details.map((detail, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-gray-400 items-start">
                      <span className="text-blue-500 shrink-0 font-bold font-mono mt-0.5">▪</span>
                      <p className="font-sans leading-normal">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practice Tip Box */}
              <div className="p-3 bg-gray-950/80 rounded-lg border border-gray-850 flex gap-2.5 text-xs text-gray-400">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold font-mono text-amber-400 uppercase">Best Practice Tip:</span>
                  <p className="font-sans leading-normal">{doc.tip}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Docs Footer Promo */}
      <div className="bg-gradient-to-r from-blue-950/20 to-indigo-950/20 border border-blue-900/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-950/40 text-blue-400 rounded-xl border border-blue-900/30">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-display">Need deeper custom architecture support?</h4>
            <p className="text-xs text-gray-400 mt-1">Read about custom agents pipeline integration guidelines or consult support buffers.</p>
          </div>
        </div>
        <a 
          href="#settings"
          onClick={(e) => {
            e.preventDefault();
            // Search command in command palette will handle settings navigation
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold text-white transition-all shadow-md shadow-blue-900/10 flex items-center gap-1.5 border border-blue-500/30 group select-none cursor-pointer"
        >
          Check API Secrets
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

    </div>
  );
}
