import React, { useState } from "react";
import { AlertOctagon, ShieldAlert, CheckCircle2, ChevronRight, Bell, Calendar, HelpCircle, X } from "lucide-react";

export interface AlertItem {
  id: string;
  category: "latency" | "cost" | "failure" | "memory" | "tool" | "prompt";
  severity: "critical" | "warning" | "info";
  message: string;
  recommendation: string;
  timestamp: string;
  status: "active" | "dismissed";
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: "alt_1",
    category: "tool",
    severity: "critical",
    message: "ToolFailure: postgres_execute_query timed out under high workspace load. Retry queue is full.",
    recommendation: "Review connection pool parameters inside production config or upgrade postgres read-replica throughput.",
    timestamp: "2 minutes ago",
    status: "active"
  },
  {
    id: "alt_2",
    category: "cost",
    severity: "warning",
    message: "BudgetAlert: Average prompt execution cost exceeded target threshold by 12% in the last 4 hours.",
    recommendation: "Limit expanded system instructions in RAG retrieval steps or truncate conversational contexts before submission.",
    timestamp: "15 minutes ago",
    status: "active"
  },
  {
    id: "alt_3",
    category: "latency",
    severity: "warning",
    message: "LatencyBudgetViolation: Semantic Retrieval Indexer averaged > 500ms latency over the last 100 epochs.",
    recommendation: "Index optimization recommended. Perform database cache warmups or rebuild semantic vector indexes.",
    timestamp: "1 hour ago",
    status: "active"
  },
  {
    id: "alt_4",
    category: "memory",
    severity: "info",
    message: "EpisodicMemorySync: Memory namespace 'production_cluster_a' synchronized successfully with 120 new context slots.",
    recommendation: "No immediate action required. Episodic recall indexes are stable and fully aligned.",
    timestamp: "2 hours ago",
    status: "active"
  }
];

interface AlertCenterProps {
  onAddToast?: (msg: string) => void;
}

export default function AlertCenter({ onAddToast }: AlertCenterProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  const activeAlerts = alerts.filter((a) => a.status === "active");

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "dismissed" as const } : a))
    );
    if (onAddToast) {
      onAddToast("Alert marked as resolved.");
    }
  };

  const severityColor = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-950/30 border-red-900/40 text-red-400";
      case "warning":
        return "bg-amber-950/20 border-amber-900/30 text-amber-400";
      case "info":
        return "bg-blue-950/20 border-blue-900/35 text-blue-400";
    }
  };

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden text-left h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-red-950/30 rounded-lg border border-red-900/35 text-red-400 animate-pulse">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white font-display">System Alert Center</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Real-time anomalous telemetry triggers</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-gray-500 bg-gray-900 border border-gray-850 px-2 py-0.5 rounded">
          {activeAlerts.length} OPEN ALERTS
        </span>
      </div>

      {/* Alert Listings */}
      <div className="flex-1 divide-y divide-gray-800/50 overflow-y-auto max-h-[340px]">
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alt) => (
            <div key={alt.id} className="p-4.5 space-y-3 hover:bg-gray-900/10 transition-colors">
              <div className="flex justify-between items-start gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono uppercase border ${severityColor(alt.severity)}`}>
                  {alt.severity}
                </span>
                <span className="text-[9px] font-mono text-gray-500">{alt.timestamp}</span>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-200 leading-relaxed font-sans">{alt.message}</p>
                <div className="flex gap-2 p-2.5 bg-gray-950/80 rounded border border-gray-850 text-[11px] text-gray-400 mt-2">
                  <span className="text-blue-400 font-bold shrink-0">REC:</span>
                  <p className="font-sans leading-normal">{alt.recommendation}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleResolveAlert(alt.id)}
                  className="px-2 py-1 bg-gray-950 hover:bg-emerald-950/20 border border-gray-850 hover:border-emerald-900/30 text-[10px] font-semibold text-gray-400 hover:text-emerald-400 rounded transition-all"
                >
                  Resolve Alert
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 p-6">
            <CheckCircle2 className="h-9 w-9 text-emerald-500/80 mb-2.5" />
            <p className="text-xs font-mono">No alerts active in current telemetry buffers.</p>
          </div>
        )}
      </div>

      {/* Footer warning indicators */}
      <div className="p-3.5 bg-gray-950 text-[10px] text-gray-500 border-t border-gray-800 font-mono flex items-center justify-between">
        <span>Metrics compliance checks: every 5000ms</span>
        <span className="text-emerald-500 uppercase font-semibold">● SECURE</span>
      </div>

    </div>
  );
}
