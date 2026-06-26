import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import LiveAgentView from "./components/LiveAgentView";
import SessionsView from "./components/SessionsView";
import TracesView from "./components/TracesView";
import AgentsView from "./components/AgentsView";
import MemoryView from "./components/MemoryView";
import PromptsView from "./components/PromptsView";
import AnalyticsView from "./components/AnalyticsView";
import ErrorsView from "./components/ErrorsView";
import SettingsView from "./components/SettingsView";
import HelpView from "./components/HelpView";
import CommandPalette from "./components/CommandPalette";

import { 
  INITIAL_HEALTH, 
  INITIAL_TOKENS, 
  INITIAL_LATENCY, 
  INITIAL_ERRORS, 
  SEEDED_SESSIONS 
} from "./lib/mockData";
import { AgentSession, SystemHealthMetrics, TokenMetrics, LatencyBreakdown, ErrorStats } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Keyboard, Play, RefreshCw, X, ShieldAlert, CheckCircle2, AlertOctagon, HelpCircle } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  title?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [geminiSupported, setGeminiSupported] = useState<boolean>(false);

  // Core synchronized states
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AgentSession | null>(null);
  const [health, setHealth] = useState<SystemHealthMetrics>(INITIAL_HEALTH);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics>(INITIAL_TOKENS);
  const [latencyBreakdown, setLatencyBreakdown] = useState<LatencyBreakdown>(INITIAL_LATENCY);
  const [errorStats, setErrorStats] = useState<ErrorStats>(INITIAL_ERRORS);

  // Modal and Interactive States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsCheatSheetOpen, setIsShortcutsCheatSheetOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toast System Handler
  const addToast = useCallback((message: string, type: ToastMessage["type"] = "success", title?: string) => {
    const id = "toast_" + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend server connection and fetch health specs on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setGeminiSupported(data.geminiSupported || false);
        console.log("[AGENTOPS] Backing Core Service connected successfully.", data);
        addToast("Connected to AgentOps core telemetry server.", "success", "System Ready");
      } catch (err) {
        console.warn("[AGENTOPS] Backing service unavailable. Operating in client standalone fallback.", err);
        setGeminiSupported(false);
        addToast("Telemetry server offline. Running in client standalone sandbox.", "warning", "Offline Standalone");
      }
    };
    checkBackend();
  }, [addToast]);

  // Initialize and load persistent session history
  useEffect(() => {
    const cachedSessions = localStorage.getItem("agentops_sessions");
    if (cachedSessions) {
      try {
        const parsed = JSON.parse(cachedSessions);
        setSessions(parsed);
      } catch (err) {
        setSessions(SEEDED_SESSIONS);
      }
    } else {
      setSessions(SEEDED_SESSIONS);
      localStorage.setItem("agentops_sessions", JSON.stringify(SEEDED_SESSIONS));
    }
  }, []);

  // Sync state changes back to metrics dashboards when a new agent execution succeeds/fails
  const handleRunCompleted = (newSession: AgentSession) => {
    // Append new session
    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem("agentops_sessions", JSON.stringify(updatedSessions));
    setSelectedSession(newSession);

    // 1. Update Token Usage charts and metrics
    setTokenMetrics((prev) => {
      const updatedDaily = [...prev.dailyUsage];
      const todayLabel = "Today";
      const existingDayIdx = updatedDaily.findIndex(d => d.date === todayLabel);

      if (existingDayIdx >= 0) {
        updatedDaily[existingDayIdx] = {
          ...updatedDaily[existingDayIdx],
          input: updatedDaily[existingDayIdx].input + newSession.tokens.input,
          output: updatedDaily[existingDayIdx].output + newSession.tokens.output,
          total: updatedDaily[existingDayIdx].total + newSession.tokens.total
        };
      } else {
        updatedDaily.push({
          date: todayLabel,
          input: newSession.tokens.input,
          output: newSession.tokens.output,
          total: newSession.tokens.total
        });
        if (updatedDaily.length > 7) updatedDaily.shift();
      }

      return {
        ...prev,
        input: prev.input + newSession.tokens.input,
        output: prev.output + newSession.tokens.output,
        total: prev.total + newSession.tokens.total,
        dailyUsage: updatedDaily
      };
    });

    // 2. Update Latency timing stack
    setLatencyBreakdown((prev) => {
      const planVal = newSession.nodes.find(n => n.id === "planner")?.duration || 320;
      const retVal = newSession.nodes.find(n => n.id === "retriever")?.duration || 450;
      const toolVal = newSession.nodes.find(n => n.id === "tools")?.duration || 850;
      const modVal = newSession.nodes.find(n => n.id === "gemini")?.duration || 1150;
      const valVal = newSession.nodes.find(n => n.id === "validator")?.duration || 180;

      const updatedHistory = [...prev.history];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      updatedHistory.push({
        timestamp: nowTime,
        planning: planVal,
        retrieval: retVal,
        tools: toolVal,
        model: modVal,
        validation: valVal
      });
      if (updatedHistory.length > 7) updatedHistory.shift();

      return {
        planning: planVal,
        retrieval: retVal,
        toolExecution: toolVal,
        modelInference: modVal,
        validation: valVal,
        history: updatedHistory
      };
    });

    // 3. Update compliance errors dashboard if failed
    if (newSession.status === "failed") {
      setErrorStats((prev) => {
        const errorType = /reboot|aws/i.test(newSession.query) ? "tool" : "model";
        const newErr = {
          id: "err_" + Math.random().toString(36).substring(2, 6),
          timestamp: new Date().toISOString(),
          category: errorType as "tool" | "model",
          message: errorType === "tool" 
            ? "AccessDeniedException: AWS IAM validation failed during ECS update deployment." 
            : "ExecutionAbortException: Agent failed validator checks.",
          sessionId: newSession.id,
          status: "unresolved" as const
        };

        return {
          ...prev,
          total: prev.total + 1,
          failures: prev.failures + 1,
          toolErrors: errorType === "tool" ? prev.toolErrors + 1 : prev.toolErrors,
          recentErrors: [newErr, ...prev.recentErrors]
        };
      });
      addToast(`Execution failed for session: ${newSession.id}`, "error", "Execution Failed");
    } else {
      addToast(`Execution completed successfully for session: ${newSession.id}`, "success", "Agent Completed");
    }
  };

  const handleResolveError = (errorId: string) => {
    setErrorStats((prev) => {
      const updatedErrors = prev.recentErrors.map((err) => {
        if (err.id === errorId) {
          return { ...err, status: "resolved" as const };
        }
        return err;
      });

      return {
        ...prev,
        failures: Math.max(0, prev.failures - 1),
        recentErrors: updatedErrors
      };
    });
    addToast(`Error exception ID ${errorId} marked as resolved.`, "success", "Resolution Approved");
  };

  // Keyboard Event Shortcut Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K -> Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl + F -> Focus active filter inputs
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="search" i]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          addToast("Search input field focused.", "info", "Shortcut Triggered");
        }
      }
      // Ctrl + S -> Export Current State / Reports
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "agentops_shortcut_export.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast("Shorthand JSON snapshot saved successfully.", "success", "Export Successful");
      }
      // ESC -> Close open palettes and modals
      if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
        setIsShortcutsCheatSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sessions, addToast]);

  // One-Click Live Demo Mode Generator (Section 11)
  const handleRunDemoSession = () => {
    const demoQueries = [
      "Optimize Redis cache-eviction queues for microservice block-b",
      "Scan container cluster memory structures for active leak anomalies",
      "Map API routes and test dynamic rate limiting policies on checkout-service",
      "Prune fragmented indices on production database stripe_billing_logs"
    ];
    const targetQuery = demoQueries[Math.floor(Math.random() * demoQueries.length)];
    const randomSessionId = "SES_" + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    const isSuccess = Math.random() > 0.15; // 85% success chance
    const durationMs = Math.round(1500 + Math.random() * 2500);
    const tokensIn = Math.round(1200 + Math.random() * 1800);
    const tokensOut = Math.round(500 + Math.random() * 1000);
    const calculatedCost = parseFloat(((tokensIn * 0.0000015) + (tokensOut * 0.000002)).toFixed(6));

    const mockDemoSession: AgentSession = {
      id: randomSessionId,
      timestamp: new Date().toISOString(),
      duration: durationMs,
      status: isSuccess ? "completed" : "failed",
      tokens: {
        input: tokensIn,
        output: tokensOut,
        total: tokensIn + tokensOut
      },
      cost: calculatedCost,
      latency: parseFloat((durationMs / 1000).toFixed(2)),
      query: targetQuery,
      nodes: [
        { id: "planner", label: "Strategy Planner", status: "completed", duration: Math.round(durationMs * 0.15) },
        { id: "retriever", label: "Semantic Indexer", status: "completed", duration: Math.round(durationMs * 0.22) },
        { id: "tools", label: "Cluster Terminal Specialist", status: isSuccess ? "completed" : "failed", duration: Math.round(durationMs * 0.35) },
        { id: "gemini", label: "Gemini Orchestrator", status: isSuccess ? "completed" : "idle", duration: Math.round(durationMs * 0.2) },
        { id: "validator", label: "Compliance Guard", status: isSuccess ? "completed" : "idle", duration: Math.round(durationMs * 0.08) }
      ],
      traces: [
        {
          id: "tr_sh_" + Math.random().toString(36).substring(2, 5),
          timestamp: "0.0s",
          nodeId: "planner",
          title: "Strategy Compilation Launched",
          description: `Formulating active runtime directives to address: "${targetQuery}"`,
          status: "completed"
        },
        {
          id: "tr_sh_" + Math.random().toString(36).substring(2, 5),
          timestamp: "0.4s",
          nodeId: "retriever",
          title: "RAG Semantic Context Loaded",
          description: "Retrieved 4 relevant system manuals and schema books from vector cache.",
          status: "completed"
        },
        {
          id: "tr_sh_" + Math.random().toString(36).substring(2, 5),
          timestamp: "1.1s",
          nodeId: "tools",
          title: "Tool Command Invocation",
          description: isSuccess 
            ? "Executed custom diagnostic tool and returned standard JSON exit code 0." 
            : "TimeoutException: Container cluster did not return execution metrics under 1500ms limit.",
          status: isSuccess ? "completed" : "failed"
        }
      ],
      toolCalls: [
        {
          id: "tc_sh_" + Math.random().toString(36).substring(2, 5),
          name: "cluster_container_audit",
          input: `{"target_node": "checkout-service", "metric": "heap_memory_allocation"}`,
          output: isSuccess ? `{"healthy": true, "leak_detected": false, "active_heap_mb": 420}` : `{"error": "Gateway Timeout on microservice port 8081"}`,
          duration: Math.round(durationMs * 0.35),
          status: isSuccess ? "completed" : "failed",
          retries: isSuccess ? 0 : 2
        }
      ],
      prompts: {
        original: targetQuery,
        expanded: `System instructions: You are an elite platform reliability engineer. Inspect microservice telemetries. Query: ${targetQuery}`,
        final: `Final context: Active cluster: production-west-4. Targets: ${targetQuery}`
      },
      memory: {
        context: "Cluster Reliability context frame",
        retrievedDocs: [
          "Memory leak policies: Heap allocations growing exponentially over 5 epochs indicate leak buffers.",
          "Thread pool boundaries: checkout-service is bounded to 200 concurrent transactional threads."
        ],
        knowledgeSources: ["Kubernetes Cluster Manual", "SRE Microservice Handbook"],
        memoryReferences: ["mem_redis_leak_last_night"],
        sessionMemory: `Saved state: Diagnostic cycle complete. Status: ${isSuccess ? "Healthy" : "Failed with Timeout"}`
      }
    };

    handleRunCompleted(mockDemoSession);
    addToast("Live execution telemetry generated and injected!", "success", "Demo Mode Active");
  };

  // Graceful View Change Handler (Skeleton Trigger)
  const handleNavigateTab = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  // Reusable Skeleton Screen Layout (Section 4)
  function SkeletonScreen() {
    return (
      <div className="flex-1 p-8 space-y-8 animate-pulse bg-[#0B0F14] text-left">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-5 border-b border-gray-800">
          <div className="space-y-2">
            <div className="h-3.5 w-32 bg-gray-800 rounded"></div>
            <div className="h-6 w-60 bg-gray-800/80 rounded"></div>
            <div className="h-3 w-80 bg-gray-850 rounded"></div>
          </div>
          <div className="h-9 w-28 bg-gray-800 rounded-lg"></div>
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="h-3 w-20 bg-gray-800 rounded"></div>
                <div className="h-7 w-7 bg-gray-800 rounded"></div>
              </div>
              <div className="h-7 w-24 bg-gray-800/80 rounded"></div>
              <div className="h-3 w-36 bg-gray-850 rounded"></div>
            </div>
          ))}
        </div>

        {/* Big Chart Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#111827] border border-gray-800 rounded-xl p-6 h-72 space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-800 rounded"></div>
                <div className="h-3 w-56 bg-gray-850 rounded"></div>
              </div>
              <div className="h-6 w-20 bg-gray-800 rounded"></div>
            </div>
            <div className="h-44 bg-gray-800/20 rounded-lg border border-gray-850/40"></div>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 h-72 space-y-4">
            <div className="h-4 w-28 bg-gray-800 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-12 bg-gray-850/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="agentops-root" className="flex h-screen w-screen bg-[#0B0F14] overflow-hidden select-none">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleNavigateTab} 
        geminiSupported={geminiSupported} 
      />

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex flex-col h-full bg-[#0B0F14] overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 overflow-hidden"
            >
              <SkeletonScreen />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              {activeTab === "dashboard" && (
                <DashboardView 
                  sessions={sessions}
                  health={health}
                  onSelectSession={(session) => {
                    setSelectedSession(session);
                    handleNavigateTab("sessions");
                  }}
                  onNavigateToTab={handleNavigateTab}
                  latencyHistory={latencyBreakdown.history}
                />
              )}

              {activeTab === "sessions" && (
                <SessionsView 
                  sessions={sessions}
                  selectedSession={selectedSession}
                  onSelectSession={setSelectedSession}
                />
              )}

              {activeTab === "live" && (
                <LiveAgentView 
                  onRunCompleted={handleRunCompleted} 
                  geminiSupported={geminiSupported}
                />
              )}

              {activeTab === "agents" && (
                <AgentsView />
              )}

              {activeTab === "memory" && (
                <MemoryView 
                  sessions={sessions}
                  selectedSession={selectedSession}
                />
              )}

              {activeTab === "prompts" && (
                <PromptsView 
                  sessions={sessions}
                  selectedSession={selectedSession}
                />
              )}

              {activeTab === "analytics" && (
                <AnalyticsView 
                  tokenMetrics={tokenMetrics}
                  latencyBreakdown={latencyBreakdown}
                  sessions={sessions}
                />
              )}

              {activeTab === "errors" && (
                <ErrorsView 
                  errorStats={errorStats} 
                  onResolveError={handleResolveError} 
                />
              )}

              {activeTab === "docs" && (
                <HelpView />
              )}

              {activeTab === "settings" && (
                <SettingsView geminiSupported={geminiSupported} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Interactive Controls (Section 11 & Shortcuts) */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3.5 select-none">
        {/* Play Demo Trigger */}
        <button 
          onClick={handleRunDemoSession}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-900/10 hover:shadow-blue-500/15 hover:scale-[1.03] active:scale-95 transition-all duration-300 border border-blue-500/30"
          title="Simulate continuous live run data"
        >
          <Play className="h-3 w-3 fill-current" />
          <span>Demo Run</span>
        </button>

        {/* Shortcuts Cheat Sheet trigger */}
        <button 
          onClick={() => setIsShortcutsCheatSheetOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-xs font-semibold text-gray-300 hover:text-white rounded-xl shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          <Keyboard className="h-3.5 w-3.5 text-gray-400" />
          <span>Shortcuts</span>
        </button>
      </div>

      {/* Top Header Command Palette Trigger */}
      <div className="fixed top-5 right-6 z-40 select-none">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#111827]/80 hover:bg-[#111827] border border-gray-800 hover:border-gray-700 text-[11px] font-medium text-gray-400 hover:text-white rounded-xl transition-all shadow-md group"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>Terminal Command</span>
          <kbd className="px-1.5 py-0.2 bg-gray-950 border border-gray-800 rounded text-[9px] font-mono text-blue-400 group-hover:text-blue-300">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Stackable Premium Toasts Notifications (Section 9) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 max-w-sm w-full select-none pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const isErr = t.type === "error";
            const isWarn = t.type === "warning";
            const isSuccess = t.type === "success";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pointer-events-auto w-full bg-[#111827] border border-gray-800 rounded-2xl p-4.5 shadow-2xl flex gap-3.5 text-left relative overflow-hidden group hover:border-gray-700 transition-colors"
              >
                {/* Visual side highlights */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isErr ? "bg-red-500" : isWarn ? "bg-amber-500" : isSuccess ? "bg-emerald-500" : "bg-blue-500"
                }`}></div>

                {/* Left accent icons */}
                <div className="shrink-0 mt-0.5">
                  {isErr ? (
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                  ) : isWarn ? (
                    <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  {t.title && (
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5 font-sans flex items-center gap-1.5">
                      {t.title}
                    </h4>
                  )}
                  <p className="text-xs text-gray-300 leading-relaxed font-sans font-medium">
                    {t.message}
                  </p>
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  className="absolute top-4.5 right-4 text-gray-500 hover:text-white rounded p-1 hover:bg-gray-800/50 transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Global Command Palette Component */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        sessions={sessions}
        onSelectSession={setSelectedSession}
        onNavigateToTab={handleNavigateTab}
        onLaunchLiveRun={(query) => {
          handleNavigateTab("live");
          // Give live session visualizer a moment to load and handle the query
          setTimeout(() => {
            const queryInput = document.querySelector('input[placeholder*="query" i], textarea') as HTMLTextAreaElement | HTMLInputElement;
            if (queryInput) {
              queryInput.value = query;
              const runButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
              if (runButton) runButton.click();
            }
          }, 600);
        }}
        onRunDemoSession={handleRunDemoSession}
        onAddToast={addToast}
      />

      {/* Keyboard Shortcuts Cheat Sheet Modal (Section 7) */}
      <AnimatePresence>
        {isShortcutsCheatSheetOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-[#0F141C] border border-gray-800 rounded-2xl p-6.5 shadow-2xl text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-3.5">
                <h3 className="text-sm font-bold font-display text-white flex items-center gap-2.5">
                  <Keyboard className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
                  Keyboard Shortcuts Registry
                </h3>
                <button 
                  onClick={() => setIsShortcutsCheatSheetOpen(false)} 
                  className="text-gray-400 hover:text-white hover:bg-gray-800/50 p-1.5 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3.5 pt-1.5 select-none">
                {[
                  { keys: ["Ctrl", "K"], desc: "Toggle interactive command palette anywhere" },
                  { keys: ["Ctrl", "F"], desc: "Quickly focus search filters on current page" },
                  { keys: ["Ctrl", "S"], desc: "Export current transactions index to JSON" },
                  { keys: ["ESC"], desc: "Dismiss open command palettes or shortcut sheets" },
                  { keys: ["↑", "↓"], desc: "Select options index within the command palette" },
                  { keys: ["Enter"], desc: "Execute active highlighted menu option" },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-850 text-xs">
                    <span className="text-gray-300 font-sans font-medium">{item.desc}</span>
                    <div className="flex gap-1 shrink-0 ml-4">
                      {item.keys.map((k, i) => (
                        <kbd key={i} className="px-2 py-0.5 bg-gray-950 text-blue-400 border border-gray-800 rounded font-mono font-bold text-[10px] uppercase shadow">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-800/40 text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase font-semibold">
                  AGENTOPS KEYBOARD SYSTEM • ONLINE
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
