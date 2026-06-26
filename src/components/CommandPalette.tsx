import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Terminal, 
  Activity, 
  BarChart3, 
  AlertOctagon, 
  Layers, 
  Cpu, 
  Database, 
  Play, 
  Settings, 
  Download, 
  RefreshCw, 
  ChevronRight, 
  Keyboard 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AgentSession } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: AgentSession[];
  onSelectSession: (session: AgentSession) => void;
  onNavigateToTab: (tab: string) => void;
  onLaunchLiveRun: (queryText: string) => void;
  onRunDemoSession?: () => void;
  onAddToast?: (msg: string, type?: "success" | "error" | "info" | "warning", title?: string) => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onNavigateToTab,
  onLaunchLiveRun,
  onRunDemoSession,
  onAddToast
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Static commands list
  const staticCommands = [
    { 
      id: "nav_dashboard", 
      label: "Open Dashboard", 
      description: "View real-time telemetries & cluster status", 
      icon: Activity, 
      action: () => { onNavigateToTab("dashboard"); onClose(); } 
    },
    { 
      id: "run_demo", 
      label: "Run Demo Session", 
      description: "Inject mock telemetry runs & cost graphs", 
      icon: Play, 
      action: () => { 
        if (onRunDemoSession) onRunDemoSession(); 
        else if (onAddToast) onAddToast("Demo mode invoked successfully.", "success", "Demo Loaded");
        onClose(); 
      } 
    },
    { 
      id: "nav_sessions", 
      label: "Search Sessions Archive", 
      description: "Browse transaction paths and execution logs", 
      icon: Layers, 
      action: () => { onNavigateToTab("sessions"); onClose(); } 
    },
    { 
      id: "nav_analytics", 
      label: "View Performance Analytics", 
      description: "Inspect token budgets & latency charts", 
      icon: BarChart3, 
      action: () => { onNavigateToTab("analytics"); onClose(); } 
    },
    { 
      id: "jump_errors", 
      label: "Jump to Errors & Diagnostics", 
      description: "Analyze pipeline aborts & exceptions", 
      icon: AlertOctagon, 
      action: () => { onNavigateToTab("errors"); onClose(); } 
    },
    { 
      id: "nav_settings", 
      label: "Open System Settings", 
      description: "Configure workspace, models & API secrets", 
      icon: Settings, 
      action: () => { onNavigateToTab("settings"); onClose(); } 
    },
    { 
      id: "export_report", 
      label: "Export Analytical Report", 
      description: "Download cluster transaction summaries (JSON/CSV)", 
      icon: Download, 
      action: () => {
        const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "agentops_report_export.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (onAddToast) onAddToast("Analytical report exported successfully as JSON.", "success", "Export Successful");
        onClose();
      }
    },
  ];

  // Filter commands and sessions matching query
  const filteredCommands = query.trim()
    ? staticCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description.toLowerCase().includes(query.toLowerCase())
      )
    : staticCommands;

  const matchingSessions = query.trim()
    ? sessions.filter(
        (s) =>
          s.id.toLowerCase().includes(query.toLowerCase()) ||
          s.query.toLowerCase().includes(query.toLowerCase()) ||
          s.prompts.final.toLowerCase().includes(query.toLowerCase())
      )
    : sessions.slice(0, 3);

  // Combine items for indexed keyboard navigation
  const totalItems = filteredCommands.length + matchingSessions.length;

  // Handle arrow key inputs
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === "Enter") {
        e.preventDefault();
        // Trigger action
        if (activeIndex < filteredCommands.length) {
          filteredCommands[activeIndex].action();
        } else {
          const sessionIndex = activeIndex - filteredCommands.length;
          const selectedSession = matchingSessions[sessionIndex];
          if (selectedSession) {
            onSelectSession(selectedSession);
            onNavigateToTab("sessions");
            onClose();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, matchingSessions, totalItems]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="cmd-palette-overlay" 
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-[12vh] p-4 select-none"
      >
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          id="cmd-palette-box"
          className="w-full max-w-2xl bg-[#0F141C] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[65vh] text-gray-200"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3.5 px-5 py-4 border-b border-gray-800 shrink-0">
            <Search className="h-5 w-5 text-blue-500 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              placeholder="Type command or search sessions, prompts, tools..."
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500 font-sans text-white font-medium"
            />
            <span className="text-[10px] font-mono text-gray-500 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded shadow">
              ESC
            </span>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
            
            {/* Command List Section */}
            {filteredCommands.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-500 uppercase px-2.5 tracking-wider font-semibold flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-gray-500" />
                  System Commands
                </span>
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={cmd.action}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 ${
                          isSelected 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10 scale-[1.01]" 
                            : "bg-[#111827]/40 hover:bg-[#111827]/80 text-gray-300 border border-transparent hover:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2 rounded-lg border transition-colors ${
                            isSelected 
                              ? "bg-blue-500 text-white border-blue-400" 
                              : "bg-gray-950 text-gray-400 border-gray-850"
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-bold leading-normal ${isSelected ? "text-white" : "text-gray-200"}`}>
                              {cmd.label}
                            </p>
                            <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                              {cmd.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && <ChevronRight className="h-4 w-4 text-white animate-bounce-horizontal shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sessions/Traces Section */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase px-2.5 tracking-wider font-semibold flex items-center gap-1.5">
                <Database className="h-3 w-3 text-gray-500" />
                {query.trim() ? "Matching Transaction Paths" : "Historical Runs & Audits"}
              </span>
              <div className="space-y-1">
                {matchingSessions.length > 0 ? (
                  matchingSessions.map((s, idx) => {
                    const globalIdx = filteredCommands.length + idx;
                    const isSelected = globalIdx === activeIndex;
                    return (
                      <button
                        key={s.id}
                        onMouseEnter={() => setActiveIndex(globalIdx)}
                        onClick={() => {
                          onSelectSession(s);
                          onNavigateToTab("sessions");
                          onClose();
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all duration-200 ${
                          isSelected 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/10 scale-[1.01]" 
                            : "bg-[#111827]/40 hover:bg-[#111827]/80 text-gray-300 border border-transparent hover:border-gray-800"
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={`p-2 rounded-lg border transition-colors ${
                            isSelected 
                              ? "bg-blue-500 text-white border-blue-400" 
                              : "bg-gray-950 text-blue-400 border-gray-850"
                          }`}>
                            <Terminal className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[11px] font-mono font-bold ${isSelected ? "text-white" : "text-blue-400"}`}>
                                {s.id}
                              </span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                                s.status === "completed" 
                                  ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40" 
                                  : "bg-red-950/20 text-red-400 border-red-900/40"
                              }`}>
                                {s.status.toUpperCase()}
                              </span>
                            </div>
                            <p className={`text-[11px] mt-1 truncate ${isSelected ? "text-blue-100" : "text-gray-300"}`}>
                              "{s.query}"
                            </p>
                          </div>
                        </div>
                        {isSelected && <ChevronRight className="h-4 w-4 text-white animate-bounce-horizontal shrink-0 ml-2" />}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 px-3.5 py-2 font-mono italic">No transaction matches discovered.</p>
                )}
              </div>
            </div>

          </div>

          {/* Key Shortcuts Footer */}
          <div className="px-5 py-3 bg-gray-950 text-[10px] text-gray-500 font-mono border-t border-gray-850 flex justify-between items-center shrink-0">
            <span className="flex items-center gap-1.5">
              <Keyboard className="h-3.5 w-3.5 text-gray-500" />
              Use <kbd className="px-1 py-0.2 bg-gray-900 border border-gray-800 rounded">↑</kbd> <kbd className="px-1 py-0.2 bg-gray-900 border border-gray-800 rounded">↓</kbd> to navigate
            </span>
            <span>
              Press <kbd className="px-1 py-0.2 bg-gray-900 border border-gray-800 rounded">Enter</kbd> to execute
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
