import React, { useState } from "react";
import { 
  Activity, 
  Terminal, 
  Layers, 
  Cpu, 
  Database, 
  FileInput, 
  BarChart3, 
  AlertOctagon, 
  Settings, 
  ChevronDown, 
  Server, 
  CircleDot,
  Network,
  HelpCircle
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiSupported: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, geminiSupported }: SidebarProps) {
  const [workspace, setWorkspace] = useState("Default Workspace");
  const [showWorkspaces, setShowWorkspaces] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "sessions", label: "Sessions", icon: Layers },
    { id: "live", label: "Live Execution", icon: Terminal, pulse: true },
    { id: "agents", label: "Registered Agents", icon: Cpu },
    { id: "memory", label: "Memory Inspector", icon: Database },
    { id: "prompts", label: "Prompt Inspector", icon: FileInput },
    { id: "analytics", label: "Token & Latency", icon: BarChart3 },
    { id: "errors", label: "Error Dashboard", icon: AlertOctagon },
    { id: "docs", label: "Docs & Guides", icon: HelpCircle },
    { id: "settings", label: "System Settings", icon: Settings },
  ];

  const workspaces = [
    {
      id: "ws_stripe",
      org: "Stripe Engineering",
      project: "Billing Core Agents",
      role: "Owner",
      membersCount: 14,
      members: [
        { name: "pravallikak2016", role: "Owner", email: "pravallikak2016@gmail.com" },
        { name: "S. Collison", role: "Admin", email: "sam@stripe.com" },
        { name: "D. Heinemeier", role: "Editor", email: "david@stripe.com" }
      ]
    },
    {
      id: "ws_acme",
      org: "Acme AI Corp",
      project: "Production Clusters",
      role: "Admin",
      membersCount: 42,
      members: [
        { name: "pravallikak2016", role: "Admin", email: "pravallikak2016@gmail.com" },
        { name: "M. Andreessen", role: "Viewer", email: "marc@acme.com" }
      ]
    },
    {
      id: "ws_sandbox",
      org: "Personal Workspace",
      project: "Local Sandboxes",
      role: "Developer",
      membersCount: 1,
      members: [
        { name: "pravallikak2016", role: "Owner", email: "pravallikak2016@gmail.com" }
      ]
    }
  ];

  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  return (
    <aside id="agentops-sidebar" className="w-64 border-r border-gray-800 bg-[#0B0F14] flex flex-col h-screen text-gray-300 font-sans select-none shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-left">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold tracking-tighter shrink-0">
            <Network className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider text-white font-display">AGENTOPS</h1>
            <p className="text-[10px] text-gray-500 font-mono">v1.2.4 • OSS</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
          <span className={`h-2 w-2 rounded-full ${geminiSupported ? "bg-emerald-500 animate-pulse" : "bg-amber-500 animate-pulse"}`}></span>
          <span className="text-[9px] font-mono text-gray-400 uppercase">{geminiSupported ? "GEMINI" : "SIMULATED"}</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div className="px-4 py-3 border-b border-gray-800/60 relative">
        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 text-left font-semibold">Active Team & Org</div>
        <button 
          onClick={() => setShowWorkspaces(!showWorkspaces)}
          className="w-full flex items-center justify-between text-left px-3 py-2 bg-[#111827] hover:bg-gray-800/80 rounded-lg border border-gray-800 transition-all text-xs font-medium text-gray-200"
        >
          <div className="flex flex-col gap-0.5 truncate">
            <div className="flex items-center gap-1.5">
              <Server className="h-3 w-3 text-blue-500 shrink-0" />
              <span className="font-bold text-white truncate text-[11px]">{activeWorkspace.org}</span>
            </div>
            <span className="text-[10px] text-gray-400 truncate pl-4.5">{activeWorkspace.project}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400 shrink-0 ml-1" />
        </button>

        {/* Floating details badge */}
        <div className="flex items-center justify-between mt-2 px-1 text-[9px] font-mono text-gray-500">
          <span>Role: <span className="text-blue-400 font-bold">{activeWorkspace.role}</span></span>
          <span>{activeWorkspace.membersCount} Seats</span>
        </div>

        {showWorkspaces && (
          <div className="absolute top-[76px] left-4 right-4 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-2 z-50 text-left space-y-1">
            <div className="px-3 py-1 border-b border-gray-850 text-[9px] font-mono text-gray-500 uppercase">Switch Workspace</div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setShowWorkspaces(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-800 transition-colors flex flex-col gap-0.5 ${
                  ws.id === activeWorkspace.id ? "bg-blue-950/20 border-l-2 border-blue-500" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${ws.id === activeWorkspace.id ? "text-blue-400" : "text-gray-200"}`}>
                    {ws.org}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 font-bold">{ws.role}</span>
                </div>
                <span className="text-[10px] text-gray-400">{ws.project}</span>
              </button>
            ))}

            {/* List active workspace member roles */}
            <div className="mt-2 pt-2 border-t border-gray-850 px-3 space-y-1.5 select-none">
              <div className="text-[9px] font-mono text-gray-500 uppercase">Active Workspace Members ({activeWorkspace.members.length})</div>
              <div className="space-y-1">
                {activeWorkspace.members.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-300 truncate max-w-[120px]">{m.name}</span>
                    <span className="text-gray-500 text-[9px] px-1 bg-gray-950 border border-gray-850 rounded">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive 
                  ? "bg-[#111827] text-white border border-gray-800 shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-105 ${isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-300"}`} />
                <span>{item.label}</span>
              </div>
              {item.pulse && (
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs bg-black/20">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            PK
          </div>
          <div>
            <p className="font-semibold text-white truncate max-w-[120px]">pravallikak2016</p>
            <p className="text-[9px] text-gray-500 truncate max-w-[120px]">pravallikak2016@gmail.com</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-[#111827] px-2 py-0.5 rounded border border-gray-800/80">
          <CircleDot className="h-2 w-2 text-emerald-500" />
          <span className="text-[8px] font-mono text-gray-400 uppercase">SYS OK</span>
        </div>
      </div>
    </aside>
  );
}
