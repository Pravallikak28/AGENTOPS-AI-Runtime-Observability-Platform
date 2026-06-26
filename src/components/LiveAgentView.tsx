import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Database, 
  Cpu, 
  Layers, 
  Terminal, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  Coins, 
  Activity, 
  HelpCircle,
  Eye,
  CornerDownRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { AgentSession, NodeState, NodeStatus } from "../types";

interface LiveAgentViewProps {
  onRunCompleted: (session: AgentSession) => void;
  geminiSupported: boolean;
}

export default function LiveAgentView({ onRunCompleted, geminiSupported }: LiveAgentViewProps) {
  const [query, setQuery] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("user");
  const [activeTab, setActiveTab] = useState<"timeline" | "tools" | "memory" | "token">("timeline");
  const [sessionData, setSessionData] = useState<AgentSession | null>(null);

  // Playback & Replay States
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Auto-scrolling ref for console
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Presets
  const presets = [
    { label: "Postgres Volume Query", text: "Extract active user emails with order volumes > $500 in May 2026" },
    { label: "AWS Container Reboot", text: "Reboot ECS auth-api container tasks inside AWS clusters" },
    { label: "SSL Caddy Config", text: "Find documentation on setting up local SSL proxy with docker-compose" }
  ];

  // Steps definition for visual pipeline
  const pipelineNodes: { id: NodeState["id"]; label: string; icon: any }[] = [
    { id: "user", label: "User Input", icon: Terminal },
    { id: "planner", label: "Planner", icon: CompassIcon },
    { id: "retriever", label: "Retriever", icon: SearchIcon },
    { id: "memory", label: "Memory", icon: Database },
    { id: "tools", label: "Tool Call", icon: Layers },
    { id: "gemini", label: "Gemini", icon: Cpu },
    { id: "validator", label: "Validator", icon: ShieldAlert },
    { id: "response", label: "Response", icon: CheckCircle2 }
  ];

  // Automated Replay player loop
  useEffect(() => {
    let playTimer: NodeJS.Timeout | null = null;
    if (isPlaying && !isRunning) {
      playTimer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < 7) {
            const nextIdx = prev + 1;
            setSelectedNodeId(pipelineNodes[nextIdx].id);
            return nextIdx;
          } else {
            setIsPlaying(false);
            if (playTimer) clearInterval(playTimer);
            return prev;
          }
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (playTimer) clearInterval(playTimer);
    };
  }, [isPlaying, isRunning, playbackSpeed]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStepIndex]);

  // Helper icons as functions to prevent type errors on imports
  function CompassIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
  }

  function SearchIcon(props: any) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
  }

  // Active status matching for each pipeline node
  const getNodeStatus = (nodeId: string, nodeIndex: number): NodeStatus => {
    if (!isRunning) {
      if (sessionData) {
        const matchingNode = sessionData.nodes.find(n => n.id === nodeId);
        return (matchingNode?.status as NodeStatus) || "completed";
      }
      return "idle";
    }
    if (currentStepIndex === nodeIndex) return "running";
    if (currentStepIndex > nodeIndex) {
      // If AWS reboot task and node is tool call, simulate failure
      if (/reboot|aws/i.test(query) && nodeId === "tools") {
        return "failed";
      }
      // If AWS reboot task and subsequent nodes are Gemini, Validator
      if (/reboot|aws/i.test(query) && (nodeId === "gemini" || nodeId === "validator")) {
        return "idle";
      }
      return "completed";
    }
    return "idle";
  };

  const executeAgentRun = async (inputQuery: string) => {
    if (!inputQuery.trim() || isRunning) return;

    setIsRunning(true);
    setSessionData(null);
    setCurrentStepIndex(0);
    setSelectedNodeId("user");

    // Animate through steps sequentially while fetching backend results
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < 7) {
          const nextIndex = prev + 1;
          setSelectedNodeId(pipelineNodes[nextIndex].id);
          return nextIndex;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 450);

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputQuery }),
      });
      const data = await response.json();
      
      // Keep pipeline running animation complete
      setTimeout(() => {
        clearInterval(stepInterval);
        setIsRunning(false);
        setCurrentStepIndex(8);
        setSessionData(data.session);
        onRunCompleted(data.session);
        setSelectedNodeId("response");
      }, 3600); // Give 3.6s for complete immersive pipeline cycle

    } catch (error) {
      console.error("Agent execution service failed", error);
      clearInterval(stepInterval);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setSessionData(null);
    setCurrentStepIndex(-1);
    setSelectedNodeId("user");
  };

  // Get current selected node details
  const getSelectedNodeDetails = () => {
    if (isRunning) {
      return `Processing Node state... Running subtask parameters dynamically.`;
    }
    if (sessionData) {
      const nodeObj = sessionData.nodes.find(n => n.id === selectedNodeId);
      return nodeObj ? nodeObj.details : "Click on any node above to audit its telemetry payload.";
    }
    return "Audit logs will populate here upon running an active session.";
  };

  // Pre-compiled log streams to simulate true system-level activities (FEATURE 2)
  const getTerminalLogs = (stepIdx: number) => {
    const logs = [];
    if (stepIdx >= 0) {
      logs.push({ t: "[00:00.005]", m: "[SYSTEM] Telemetry environment initialized successfully.", c: "text-gray-500" });
      logs.push({ t: "[00:00.040]", m: `[USER] Input query captured: "${query || 'No query input'}"`, c: "text-blue-400 font-semibold" });
    }
    if (stepIdx >= 1) {
      logs.push({ t: "[00:00.120]", m: "[PLANNER] Decomposing statements into logical dependency matrices...", c: "text-gray-400" });
      logs.push({ t: "[00:00.410]", m: "[PLANNER] Router maps identified. Dispatched task queue: [retrieve, tools, validate].", c: "text-indigo-400" });
    }
    if (stepIdx >= 2) {
      logs.push({ t: "[00:00.580]", m: "[RETRIEVER] Scanning vector space indices using high-dimensional cosine similarity...", c: "text-gray-400" });
      logs.push({ t: "[00:00.920]", m: "[RETRIEVER] Vector scan complete. Injected context chunks: 3 slots matched.", c: "text-teal-400" });
    }
    if (stepIdx >= 3) {
      logs.push({ t: "[00:01.050]", m: "[MEMORY] Fetching episodic preference graph buffers...", c: "text-gray-400" });
      logs.push({ t: "[00:01.290]", m: "[MEMORY] Loaded 1 active workspace profile state frame.", c: "text-purple-400" });
    }
    if (stepIdx >= 4) {
      logs.push({ t: "[00:01.420]", m: "[TOOLS] Dispatching active executor wrapper for selected platform action...", c: "text-gray-400" });
      if (/reboot|aws/i.test(query)) {
        logs.push({ t: "[00:01.810]", m: "[TOOLS] [CRITICAL] AccessDeniedException: AWS IAM user 'runner' unauthorized for 'ecs:UpdateService'.", c: "text-red-400 font-semibold" });
      } else {
        logs.push({ t: "[00:01.990]", m: "[TOOLS] postgres_execute_query output: 5 rows serialized into JSON stream successfully.", c: "text-emerald-400" });
      }
    }
    if (stepIdx >= 5) {
      if (/reboot|aws/i.test(query)) {
        logs.push({ t: "[00:02.100]", m: "[GEMINI] [ABORTED] Skip inference. Pipeline is in FAILED state.", c: "text-amber-500" });
      } else {
        logs.push({ t: "[00:02.150]", m: "[GEMINI] Dynamic context frames hydrated. Submitting payload to 'gemini-3.5-flash' inference engine...", c: "text-gray-400" });
        logs.push({ t: "[00:03.110]", m: "[GEMINI] Response tokens synthesized successfully. total_tokens: 382.", c: "text-indigo-400" });
      }
    }
    if (stepIdx >= 6) {
      if (/reboot|aws/i.test(query)) {
        logs.push({ t: "[00:03.200]", m: "[VALIDATOR] [ABORTED] Skipping guard checks.", c: "text-amber-500" });
      } else {
        logs.push({ t: "[00:03.280]", m: "[VALIDATOR] Applying enterprise safety bounds and token disclosure scans...", c: "text-gray-400" });
        logs.push({ t: "[00:03.390]", m: "[VALIDATOR] Integrity: MATCH. Safety: PASSED.", c: "text-emerald-400 font-semibold" });
      }
    }
    if (stepIdx >= 7) {
      if (/reboot|aws/i.test(query)) {
        logs.push({ t: "[00:03.450]", m: "[RESPONSE] Output formatted with failure diagnostics.", c: "text-red-400" });
      } else {
        logs.push({ t: "[00:03.450]", m: "[RESPONSE] Response dispatched back to client viewport. Rendered successfully.", c: "text-emerald-400" });
      }
      logs.push({ t: "[00:03.500]", m: "[SYSTEM] Telemetry buffers closed. Session log finalized.", c: "text-gray-500 font-bold" });
    }
    return logs;
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 flex flex-col space-y-6 font-sans">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
              HERO UTILITY
            </span>
            <h2 className="text-xl font-bold font-display text-white">Live Agent execution Visualizer</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Dispatch queries to trace the complete chain of thought, semantic indexing lookups, tool invocation buffers, and guardrail validations.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-900 px-3 py-1.5 rounded border border-gray-800">
          <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>{geminiSupported ? "Active Gemini Orchestrator Mode" : "Simulation Mode Active"}</span>
        </div>
      </div>

      {/* Controller Area */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type search terms or select an enterprise preset query below..."
            className="flex-1 bg-gray-950/80 border border-gray-800 rounded-lg px-4 py-3 text-xs focus:outline-none focus:border-blue-500 font-mono text-gray-200"
            disabled={isRunning}
            onKeyDown={(e) => {
              if (e.key === "Enter") executeAgentRun(query);
            }}
          />
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => executeAgentRun(query)}
              disabled={isRunning || !query.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg text-xs font-semibold text-white transition-all flex items-center gap-1.5 border border-blue-500/30"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Run Agent
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="p-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Reset query"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(p.text)}
              disabled={isRunning}
              className="text-[11px] bg-gray-900 hover:bg-gray-800/80 border border-gray-800/80 rounded px-2.5 py-1 text-gray-400 hover:text-white transition-colors font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visualizer Pipeline Nodes Canvas & Replay System */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 relative space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4">
          <div>
            <h3 className="text-xs font-mono font-medium text-gray-400 tracking-wider uppercase">Execution Pipeline Replay</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">Control live state-machine playback or inspect historical frames</p>
          </div>
          
          {/* Replay Controls (FEATURE 1) */}
          <div className="flex flex-wrap items-center gap-3 bg-gray-950 p-2 rounded-lg border border-gray-850 text-xs font-mono select-none">
            {/* Previous Step */}
            <button
              onClick={() => {
                setIsPlaying(false);
                const prev = Math.max(0, currentStepIndex - 1);
                setCurrentStepIndex(prev);
                setSelectedNodeId(pipelineNodes[prev].id);
              }}
              disabled={currentStepIndex <= 0 || isRunning}
              className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Previous Step"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isRunning || currentStepIndex === 7 || currentStepIndex === -1}
              className="p-1.5 bg-blue-950/40 hover:bg-blue-900/30 text-blue-400 border border-blue-900/40 rounded transition-colors disabled:opacity-30"
              title={isPlaying ? "Pause Playback" : "Play Playback"}
            >
              {isPlaying ? (
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next Step */}
            <button
              onClick={() => {
                setIsPlaying(false);
                const next = Math.min(7, currentStepIndex + 1);
                setCurrentStepIndex(next);
                setSelectedNodeId(pipelineNodes[next].id);
              }}
              disabled={currentStepIndex >= 7 || isRunning}
              className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Next Step"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>

            {/* Playback Speed */}
            <div className="h-4 w-[1px] bg-gray-800" />
            <div className="flex gap-1">
              {([0.5, 1.0, 2.0] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    playbackSpeed === spd
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Scrubber Bar (FEATURE 1) */}
        {currentStepIndex >= 0 && (
          <div className="flex items-center gap-4 bg-gray-950/60 p-3.5 rounded-xl border border-gray-850/80 text-xs font-mono">
            <span className="text-gray-400 uppercase text-[9px] font-semibold shrink-0">Scrubber Timeline:</span>
            <input
              type="range"
              min="0"
              max="7"
              value={currentStepIndex}
              onChange={(e) => {
                setIsPlaying(false);
                const val = Number(e.target.value);
                setCurrentStepIndex(val);
                setSelectedNodeId(pipelineNodes[val].id);
              }}
              disabled={isRunning}
              className="flex-1 accent-blue-500 h-1 bg-gray-800 rounded-lg cursor-pointer"
            />
            <span className="text-blue-400 font-bold w-12 text-right shrink-0">
              STEP {currentStepIndex + 1}/8
            </span>
          </div>
        )}
        
        {/* Connection pipeline line container */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 select-none overflow-x-auto bg-gray-950/20 rounded-xl border border-gray-850/40 p-4">
          {pipelineNodes.map((node, index) => {
            const IconComponent = node.icon;
            const status = getNodeStatus(node.id, index);
            const isSelected = selectedNodeId === node.id;
            
            // Stylings based on node status
            let borderStyle = "border-gray-800";
            let bgStyle = "bg-gray-950/80 text-gray-500";
            let glowStyle = "";

            if (status === "running") {
              borderStyle = "border-blue-500";
              bgStyle = "bg-blue-950/20 text-blue-400 animate-pulse";
              glowStyle = "shadow-[0_0_12px_rgba(59,130,246,0.35)]";
            } else if (status === "completed") {
              borderStyle = "border-emerald-500/60";
              bgStyle = "bg-emerald-950/10 text-emerald-400";
            } else if (status === "failed") {
              borderStyle = "border-red-500/60";
              bgStyle = "bg-red-950/10 text-red-400";
            }

            if (isSelected) {
              borderStyle = "border-blue-400 ring-2 ring-blue-500/20";
            }

            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border ${borderStyle} ${bgStyle} ${glowStyle} transition-all duration-300 w-24 shrink-0 hover:border-gray-600`}
                >
                  <div className="p-2 bg-black/20 rounded-lg border border-gray-800/40 mb-1.5">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-center truncate w-full">{node.label}</span>
                  <span className={`text-[8px] font-mono mt-1 ${
                    status === "running" ? "text-blue-400" :
                    status === "completed" ? "text-emerald-400" :
                    status === "failed" ? "text-red-400" : "text-gray-600"
                  }`}>
                    {status.toUpperCase()}
                  </span>
                </button>
                {index < 7 && (
                  <div className="hidden md:block shrink-0">
                    <ArrowRight className={`h-4 w-4 ${
                      currentStepIndex > index ? "text-emerald-500" :
                      currentStepIndex === index ? "text-blue-400 animate-pulse" : "text-gray-850"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Live Execution Stream Terminal Console (FEATURE 2) */}
        {currentStepIndex >= 0 && (
          <div className="bg-black border border-gray-850 rounded-xl overflow-hidden font-mono text-[11px] text-gray-400 flex flex-col h-56 shadow-inner select-text">
            <div className="px-4 py-2 bg-gray-950 border-b border-gray-850 flex items-center justify-between text-[10px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="ml-2 font-semibold">terminal_execution_stream.log</span>
              </div>
              <span>UTF-8</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-left font-mono">
              {getTerminalLogs(currentStepIndex).map((log, idx) => (
                <div key={idx} className="flex gap-3 leading-relaxed">
                  <span className="text-gray-600 select-none">{log.t}</span>
                  <span className={log.c}>{log.m}</span>
                </div>
              ))}
              <div ref={terminalEndRef} className="h-1 flex items-center gap-1">
                <span className="h-3 w-1.5 bg-blue-500 animate-pulse inline-block"></span>
              </div>
            </div>
          </div>
        )}

        {/* Info panel of selected node */}
        <div className="mt-6 p-4 bg-gray-950/80 rounded-lg border border-gray-800/60 flex items-start gap-3">
          <div className="p-2 bg-blue-950/20 text-blue-400 rounded border border-blue-900/30">
            <Eye className="h-4 w-4" />
          </div>
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white capitalize">{selectedNodeId} Payload Audit</span>
              {sessionData && (
                <span className="text-[9px] font-mono text-gray-500">
                  Node Duration: {sessionData.nodes.find(n => n.id === selectedNodeId)?.duration || 120}ms
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 font-mono leading-relaxed">{getSelectedNodeDetails()}</p>
          </div>
        </div>
      </div>

      {/* Main Bottom Tabs: Timeline, Tool calls, Memory, Token usages */}
      <div className="border border-gray-800 rounded-xl bg-[#111827] overflow-hidden flex flex-col flex-1 min-h-[300px]">
        
        {/* Tabs Bar */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 px-4">
          {(["timeline", "tools", "memory", "token"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider font-mono border-b-2 transition-all ${
                activeTab === tab 
                  ? "border-blue-500 text-white" 
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab === "timeline" ? "Execution Timeline" :
               tab === "tools" ? "Tool Calls" :
               tab === "memory" ? "Memory" : "Usage & Costs"}
            </button>
          ))}
        </div>

        {/* Tab Panel contents */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-950/20">
          
          {/* TIMELINE TAB */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              {sessionData ? (
                <div className="relative border-l-2 border-gray-800/80 ml-3 pl-6 space-y-6 py-2">
                  {sessionData.traces.map((trace) => (
                    <div key={trace.id} className="relative group">
                      {/* Circle indicator on left line */}
                      <span className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 bg-gray-900 ${
                        trace.status === "completed" ? "border-emerald-500" :
                        trace.status === "failed" ? "border-red-500" :
                        trace.status === "running" ? "border-blue-400 animate-pulse" : "border-gray-800"
                      }`}></span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-gray-500">{trace.timestamp}</span>
                          <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">{trace.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-gray-900 border border-gray-800/60 rounded text-gray-400 uppercase">
                            {trace.nodeId}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">{trace.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <Activity className="h-10 w-10 text-gray-700 mb-2.5 animate-pulse" />
                  <p className="text-xs font-mono">No active trace streams. Input a query to boot an observability process.</p>
                </div>
              )}
            </div>
          )}

          {/* TOOL CALLS TAB */}
          {activeTab === "tools" && (
            <div className="space-y-4">
              {sessionData && sessionData.toolCalls.length > 0 ? (
                <div className="space-y-4">
                  {sessionData.toolCalls.map((tc) => (
                    <div key={tc.id} className="bg-[#111827]/60 border border-gray-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-500">{tc.id}</span>
                          <span className="text-xs font-bold text-white font-mono">{tc.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono">
                          <span className="text-gray-500">Duration: {tc.duration}ms</span>
                          <span className={`px-2 py-0.5 rounded-full border ${
                            tc.status === "completed" 
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" 
                              : "bg-red-950/40 text-red-400 border-red-900/30"
                          }`}>
                            {tc.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] font-mono">
                        <div className="space-y-1">
                          <span className="text-gray-500 uppercase tracking-wider text-[9px]">Input payload:</span>
                          <pre className="bg-gray-950 p-2.5 rounded border border-gray-850 overflow-x-auto text-blue-300 max-h-40">{tc.input}</pre>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 uppercase tracking-wider text-[9px]">Response output:</span>
                          <pre className="bg-gray-950 p-2.5 rounded border border-gray-850 overflow-x-auto text-emerald-300 max-h-40">{tc.output}</pre>
                        </div>
                      </div>

                      {tc.error && (
                        <div className="flex items-center gap-2 bg-red-950/20 text-red-400 p-2.5 rounded border border-red-900/30 text-xs font-mono">
                          <ShieldAlert className="h-4 w-4 shrink-0" />
                          <span>Retry error logs: {tc.error}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <Layers className="h-10 w-10 text-gray-700 mb-2.5" />
                  <p className="text-xs font-mono">No active tool executions captured for this frame sequence.</p>
                </div>
              )}
            </div>
          )}

          {/* MEMORY TAB */}
          {activeTab === "memory" && (
            <div className="space-y-4">
              {sessionData ? (
                <div className="space-y-4 font-mono text-xs">
                  <div className="bg-[#111827]/60 border border-gray-800 rounded-lg p-4 space-y-2">
                    <span className="text-[10px] text-gray-500 uppercase">Context frame scope:</span>
                    <p className="text-gray-300 font-sans">{sessionData.memory.context}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#111827]/60 border border-gray-800 rounded-lg p-4 space-y-2">
                      <span className="text-[10px] text-gray-500 uppercase">Retrieved semantic chunks:</span>
                      <ul className="space-y-1.5 font-sans text-xs text-gray-400">
                        {sessionData.memory.retrievedDocs.map((doc, i) => (
                          <li key={i} className="flex gap-2 items-start">
                            <ChevronRight className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#111827]/60 border border-gray-800 rounded-lg p-4 space-y-2">
                      <span className="text-[10px] text-gray-500 uppercase">Session Memory state (Post Run):</span>
                      <p className="text-gray-300 font-sans">{sessionData.memory.sessionMemory}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <Database className="h-10 w-10 text-gray-700 mb-2.5" />
                  <p className="text-xs font-mono">Episodic memory buffers are empty.</p>
                </div>
              )}
            </div>
          )}

          {/* TOKEN TAB */}
          {activeTab === "token" && (
            <div className="space-y-4">
              {sessionData ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Tokens Consumed</span>
                    <div className="my-2.5">
                      <span className="text-2xl font-bold text-white font-display">{sessionData.tokens.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                      <span>Input: {sessionData.tokens.input}</span>
                      <span>Output: {sessionData.tokens.output}</span>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Execution Cost (USD)</span>
                    <div className="my-2.5">
                      <span className="text-2xl font-bold text-emerald-400 font-display">${sessionData.cost.toFixed(6)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans">
                      Computed via flash input/output weights.
                    </span>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">Process Latency</span>
                    <div className="my-2.5">
                      <span className="text-2xl font-bold text-blue-400 font-display">{sessionData.latency}s</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans">
                      Total multi-node synchronous processing time.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                  <Coins className="h-10 w-10 text-gray-700 mb-2.5" />
                  <p className="text-xs font-mono">Run a session to calculate exact token sizes and network cost allocations.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
