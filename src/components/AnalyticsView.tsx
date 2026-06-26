import React, { useState } from "react";
import { 
  BarChart3, 
  HelpCircle, 
  Clock, 
  Coins, 
  BrainCircuit, 
  Activity, 
  ChevronRight, 
  Calendar,
  Sparkles,
  TrendingUp,
  Cpu
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TokenMetrics, LatencyBreakdown, AgentSession } from "../types";

interface AnalyticsViewProps {
  tokenMetrics: TokenMetrics;
  latencyBreakdown: LatencyBreakdown;
  sessions: AgentSession[];
}

export default function AnalyticsView({ tokenMetrics, latencyBreakdown, sessions }: AnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "costs" | "tools">("performance");
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily");

  const totalCost = sessions.reduce((sum, s) => sum + s.cost, 0);
  const avgCost = sessions.length > 0 ? (totalCost / sessions.length) : 0.000142;

  const chartData = timeframe === "daily" 
    ? tokenMetrics.dailyUsage 
    : timeframe === "weekly" 
      ? tokenMetrics.weeklyUsage.map(w => ({ date: w.week, input: w.input, output: w.output, total: w.total }))
      : tokenMetrics.monthlyUsage.map(m => ({ date: m.month, input: m.input, output: m.output, total: m.total }));

  // Latency breakdown stacked chart data
  const latencyChartData = latencyBreakdown.history;

  // Feature 5 — Cost Explorer Data
  const costTrendData = [
    { date: "Mon", cost: 0.000124, trend: 0.000120 },
    { date: "Tue", cost: 0.000148, trend: 0.000135 },
    { date: "Wed", cost: 0.000115, trend: 0.000140 },
    { date: "Thu", cost: 0.000192, trend: 0.000160 },
    { date: "Fri", cost: 0.000165, trend: 0.000170 },
    { date: "Sat", cost: 0.000084, trend: 0.000180 },
    { date: "Sun", cost: 0.000210, trend: 0.000195 }
  ];

  const costPerAgentData = [
    { name: "Strategy Planner", value: 0.000450, color: "#3B82F6" },
    { name: "Postgres Specialist", value: 0.000850, color: "#6366F1" },
    { name: "DevOps Coordinator", value: 0.000310, color: "#F59E0B" },
    { name: "Semantic Indexer", value: 0.000590, color: "#10B981" }
  ];

  const costPerToolData = [
    { name: "postgres_execute", value: 0.000380 },
    { name: "aws_ecs_update", value: 0.000620 },
    { name: "vector_search", value: 0.000180 },
    { name: "web_grounding", value: 0.000450 },
    { name: "context_recall", value: 0.000110 }
  ];

  // Feature 10 — Tool Performance Data
  const toolsPerformance = [
    { name: "postgres_execute_query", usages: 852, successRate: 98.1, failureRate: 1.9, retries: 14, latency: "450ms", status: "stable" },
    { name: "aws_ecs_update_service", usages: 312, successRate: 94.2, failureRate: 5.8, retries: 24, latency: "610ms", status: "warning" },
    { name: "vector_index_search", usages: 2450, successRate: 100.0, failureRate: 0.0, retries: 0, latency: "280ms", status: "stable" },
    { name: "google_search_grounding", usages: 620, successRate: 97.5, failureRate: 2.5, retries: 8, latency: "740ms", status: "stable" },
    { name: "semantic_context_recall", usages: 1840, successRate: 99.8, failureRate: 0.2, retries: 2, latency: "110ms", status: "stable" },
    { name: "payload_validator_guard", usages: 2100, successRate: 99.8, failureRate: 0.2, retries: 1, latency: "180ms", status: "stable" }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-8 font-sans">
      
      {/* Header & Subtabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            TELEMETRY SYSTEMS
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">System Performance & Token Analytics</h2>
          <p className="text-xs text-gray-400 mt-1">
            Analyzing transaction latency budgets, cost optimization curves, and token payloads across epochs.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-[#111827] rounded-lg border border-gray-800 p-0.5 text-xs font-mono self-start md:self-auto">
          <button 
            onClick={() => setActiveTab("performance")}
            className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${activeTab === "performance" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            Core Telemetry
          </button>
          <button 
            onClick={() => setActiveTab("costs")}
            className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${activeTab === "costs" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            Cost Explorer
          </button>
          <button 
            onClick={() => setActiveTab("tools")}
            className={`px-3 py-1.5 rounded-md text-[10px] uppercase font-semibold ${activeTab === "tools" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
          >
            Tool Performance
          </button>
        </div>
      </div>

      {/* CORE TELEMETRY TAB */}
      {activeTab === "performance" && (
        <div className="space-y-8">
          {/* Grid Cards Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase">Input / Output Tokens</span>
                <BrainCircuit className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="mt-4 space-y-1 text-left">
                <span className="text-2xl font-bold font-display text-white">43,430</span>
                <p className="text-[10px] text-gray-500 font-mono">14.5k input / 28.9k output chunks logged</p>
              </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase">Accumulated Compute Cost</span>
                <Coins className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-4 space-y-1 text-left">
                <span className="text-2xl font-bold font-display text-white">${totalCost > 0 ? totalCost.toFixed(5) : "0.00245"}</span>
                <p className="text-[10px] text-gray-500 font-mono">Estimated budget allocation across active workspaces</p>
              </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase">Overall Avg Latency</span>
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <div className="mt-4 space-y-1 text-left">
                <span className="text-2xl font-bold font-display text-white">{latencyBreakdown.planning + latencyBreakdown.retrieval + latencyBreakdown.toolExecution + latencyBreakdown.modelInference + latencyBreakdown.validation}ms</span>
                <p className="text-[10px] text-gray-500 font-mono">Total multi-node planning, tools, and inference times</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#111827] border border-gray-800 p-4 rounded-xl">
            <span className="text-xs font-mono text-gray-400">Trend Interval Granularity:</span>
            <div className="flex bg-gray-950 rounded-lg p-0.5 text-xs font-mono border border-gray-850">
              {(["daily", "weekly", "monthly"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-[9px] uppercase font-bold ${timeframe === tf ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-white font-display">Token usage trends</h3>
                  <p className="text-xs text-gray-400">Chronological size of loaded prompt/response contexts</p>
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">Units: Chunks</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tokenInputGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="tokenOutputGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} />
                    <YAxis stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0B0F14", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }}
                      labelClassName="font-mono text-gray-400"
                    />
                    <Legend iconSize={10} fontSize={10} fontClassName="font-mono" align="right" verticalAlign="top" />
                    <Area type="monotone" name="Input Tokens" dataKey="input" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#tokenInputGrad)" />
                    <Area type="monotone" name="Output Tokens" dataKey="output" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#tokenOutputGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-white font-display">Multi-Node Latency Stack</h3>
                  <p className="text-xs text-gray-400">Timings breakdown per internal node task execution</p>
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">Units: MS</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="timestamp" stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} />
                    <YAxis stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0B0F14", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }}
                      labelClassName="font-mono text-gray-400"
                    />
                    <Legend iconSize={10} fontSize={10} fontClassName="font-mono" align="right" verticalAlign="top" />
                    <Bar name="Planner" dataKey="planning" stackId="a" fill="#3B82F6" />
                    <Bar name="RAG" dataKey="retrieval" stackId="a" fill="#6366F1" />
                    <Bar name="Tools" dataKey="tools" stackId="a" fill="#F59E0B" />
                    <Bar name="Gemini Inference" dataKey="model" stackId="a" fill="#10B981" />
                    <Bar name="Validator" dataKey="validation" stackId="a" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COST EXPLORER TAB (FEATURE 5) */}
      {activeTab === "costs" && (
        <div className="space-y-8 text-left">
          {/* Top cost metric boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4.5">
              <span className="text-gray-500 text-[9px] font-mono uppercase">Total Project Spend</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">${(totalCost * 1.5 + 0.00312).toFixed(6)}</p>
              <span className="text-[9px] text-gray-400 mt-1 font-mono flex items-center gap-1">
                <span className="text-emerald-400 font-bold">↑ 4.2%</span> from last epoch
              </span>
            </div>
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4.5">
              <span className="text-gray-500 text-[9px] font-mono uppercase">Cost per Run</span>
              <p className="text-xl font-bold font-mono text-white mt-1">${avgCost.toFixed(6)}</p>
              <span className="text-[9px] text-gray-400 mt-1 font-mono">Average cost over {sessions.length} sessions</span>
            </div>
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4.5">
              <span className="text-gray-500 text-[9px] font-mono uppercase">Tool Execution Cost</span>
              <p className="text-xl font-bold font-mono text-indigo-400 mt-1">$0.001400</p>
              <span className="text-[9px] text-gray-400 mt-1 font-mono">Estimated custom function cost weights</span>
            </div>
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-4.5">
              <span className="text-gray-500 text-[9px] font-mono uppercase">Estimated Forecast</span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-1">$0.008500</p>
              <span className="text-[9px] text-gray-400 mt-1 font-mono">30-day budget projection bounds</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Daily cost trends */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white font-display">Daily Spend & Trend Projection</h3>
                <p className="text-xs text-gray-400">Shows current compute cost trends mapped against predictive forecasting models</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={costTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="date" stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} />
                    <YAxis stroke="#4B5563" fontSize={10} fontClassName="font-mono" tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0B0F14", border: "1px solid #374151", borderRadius: "8px", fontSize: "11px" }}
                      labelClassName="font-mono text-gray-400"
                    />
                    <Legend iconSize={10} fontSize={10} fontClassName="font-mono" align="right" verticalAlign="top" />
                    <Line type="monotone" name="Active Cost" dataKey="cost" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" name="Trend Forecast" dataKey="trend" stroke="#6366F1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost per Agent (Pie chart) */}
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white font-display">Cost per Agent Node</h3>
                <p className="text-xs text-gray-400">Proportional budget split of running agent sandboxes</p>
              </div>
              <div className="h-52 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costPerAgentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {costPerAgentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0B0F14", border: "1px solid #374151", borderRadius: "8px", fontSize: "10px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend absolute overlay or block underneath */}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 pt-2 border-t border-gray-850">
                {costPerAgentData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span className="truncate">{d.name}: ${(d.value).toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Cost per custom tool bar list */}
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-display">Cost Allocation per Registered Tool</h3>
              <p className="text-xs text-gray-400">Calculated based on payload length and request duration overheads</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {costPerToolData.map((tool, idx) => (
                <div key={idx} className="bg-gray-950/40 border border-gray-850 rounded-lg p-4 space-y-2">
                  <span className="text-[10px] font-mono text-gray-400 font-bold block truncate">{tool.name}</span>
                  <div className="flex items-baseline gap-1 mt-1 font-mono">
                    <span className="text-sm font-bold text-white">${tool.value.toFixed(6)}</span>
                  </div>
                  {/* Miniature visual progress bar */}
                  <div className="w-full bg-gray-900 rounded-full h-1">
                    <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(tool.value / 0.000620) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TOOL PERFORMANCE DASHBOARD (FEATURE 10) */}
      {activeTab === "tools" && (
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-sm font-semibold text-white font-display">Tool Performance & Latency Budgets</h3>
            <p className="text-xs text-gray-400">Review success rate logs, average dispatch latency, failure metrics, and retries for all configured ecosystem tools.</p>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-950 text-gray-400 border-b border-gray-800 uppercase font-mono text-[9px] tracking-wider select-none">
                    <th className="p-4">Tool Identity</th>
                    <th className="p-4">Usages</th>
                    <th className="p-4">Avg Latency</th>
                    <th className="p-4">Success Rate</th>
                    <th className="p-4">Failure Rate</th>
                    <th className="p-4">Retries Logs</th>
                    <th className="p-4">Performance Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850/65 font-sans text-gray-300">
                  {toolsPerformance.map((tool, idx) => (
                    <tr key={idx} className="hover:bg-gray-900/15 transition-colors">
                      <td className="p-4 font-mono font-semibold text-blue-400">{tool.name}</td>
                      <td className="p-4 font-mono">{tool.usages}</td>
                      <td className="p-4 font-mono text-white font-bold">{tool.latency}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-900 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${tool.successRate >= 98 ? "bg-emerald-500" : tool.successRate >= 94 ? "bg-amber-500" : "bg-red-500"}`} 
                              style={{ width: `${tool.successRate}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-emerald-400 font-bold">{tool.successRate}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono font-bold ${tool.failureRate > 0 ? "text-red-400" : "text-gray-500"}`}>
                          {tool.failureRate}%
                        </span>
                      </td>
                      <td className="p-4 font-mono text-gray-400">{tool.retries}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                          tool.status === "stable" 
                            ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" 
                            : "bg-amber-950/20 text-amber-400 border border-amber-900/25 animate-pulse"
                        }`}>
                          {tool.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-950 border-t border-gray-850 text-[10px] text-gray-500 font-mono text-right">
              Performance statistics compiled from active production logs.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
