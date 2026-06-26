import React, { useState } from "react";
import { 
  Settings, 
  HelpCircle, 
  Key, 
  Server, 
  Database, 
  CheckCircle, 
  Info,
  Shield,
  Eye,
  Activity,
  Heart,
  Sliders,
  Bell,
  Lock,
  Globe,
  Trash2,
  Save,
  CheckCircle2
} from "lucide-react";

interface SettingsViewProps {
  geminiSupported: boolean;
}

export default function SettingsView({ geminiSupported }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"general" | "security" | "notifications" | "storage">("general");

  // Form states with local interaction
  const [orgName, setOrgName] = useState("Stripe Engineering");
  const [projectName, setProjectName] = useState("Billing Core Agents");
  const [environment, setEnvironment] = useState("production");
  const [modelEndpoint, setModelEndpoint] = useState("gemini-2.5-flash");
  
  const [ipRestrictions, setIpRestrictions] = useState("10.142.0.0/16, 192.168.1.0/24");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  
  const [slackWebhook, setSlackWebhook] = useState("https://hooks.slack.com/services/T000/B000/XXXX");
  const [pagerDutyKey, setPagerDutyKey] = useState("pd_routing_billing_alerts_v4");
  const [alertSeverity, setAlertSeverity] = useState<"all" | "errors" | "critical">("errors");
  
  const [retentionDays, setRetentionDays] = useState(45);
  const [region, setRegion] = useState("us-central1");
  const [autoPruning, setAutoPruning] = useState(true);

  // Save feedback state
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 850);
  };

  const tabs = [
    { id: "general", label: "General Configuration", icon: Sliders },
    { id: "security", label: "Security & Credentials", icon: Lock },
    { id: "notifications", label: "Alerting & Integrations", icon: Bell },
    { id: "storage", label: "Storage & Retention", icon: Database }
  ] as const;

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row h-screen text-gray-200 font-sans bg-[#0B0F14]">
      
      {/* Settings Left Rail Menu */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col bg-[#0B0F14] shrink-0">
        
        {/* Rail Header */}
        <div className="p-6 border-b border-gray-800/60 shrink-0">
          <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded uppercase font-semibold">
            WORKSPACE PROFILE
          </span>
          <h2 className="text-base font-bold font-display text-white mt-2">System Settings</h2>
          <p className="text-[10px] text-gray-500 mt-0.5">Configure compliance indices and endpoints.</p>
        </div>

        {/* Rail Navigation list */}
        <div className="flex-1 p-3.5 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSaveStatus("idle");
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  isSelected 
                    ? "bg-[#111827] text-white border border-gray-800 shadow" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900/40"
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? "text-blue-500" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Configuration Footer button */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/40">
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving"}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-850 rounded-lg text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2"
          >
            {saveStatus === "saving" ? (
              <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : saveStatus === "saved" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Settings Saved" : "Save Changes"}
            </span>
          </button>
        </div>
      </div>

      {/* Settings Right Configuration Panel */}
      <div className="flex-1 overflow-y-auto p-8 text-left space-y-6">

        {activeTab === "general" && (
          <div className="space-y-6 max-w-2xl animate-slide-in">
            <div>
              <h3 className="text-base font-bold font-display text-white">General Configuration</h3>
              <p className="text-xs text-gray-400 mt-1">Manage global identifiers, active deployment boundaries, and backing language model preferences.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Organization Identifier</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Active Environment</label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-medium select-none"
                  >
                    <option value="development">development-sandbox</option>
                    <option value="staging">staging-canary-b</option>
                    <option value="production">production-cluster-us</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Core LLM Intelligence</label>
                  <select
                    value={modelEndpoint}
                    onChange={(e) => setModelEndpoint(e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-medium select-none"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Low Latency)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (High Reasoning)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro (Legacy Context)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-950/10 border border-blue-900/25 rounded-xl flex gap-3 text-xs leading-relaxed text-gray-400">
                <Globe className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-blue-300">Continuous Cluster Replication</span>
                  <p className="text-[11px]">Telemetry logs are securely replicated across three availability zones to guarantee continuous 99.99% uptime compliance index charts.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6 max-w-2xl animate-slide-in">
            <div>
              <h3 className="text-base font-bold font-display text-white">Security & API Keys</h3>
              <p className="text-xs text-gray-400 mt-1">Audit active API connections, configure IP address allow-lists, and set encryption requirements.</p>
            </div>

            <div className="space-y-4">
              {/* Gemini status */}
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-850 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-gray-300 block">Google Gemini Connection</span>
                  <span className="text-[10px] font-mono text-gray-500">process.env.GEMINI_API_KEY</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-gray-800 bg-gray-900 font-mono">
                  <span className={`h-1.5 w-1.5 rounded-full ${geminiSupported ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                  <span className="text-[9px] text-gray-400 uppercase">
                    {geminiSupported ? "Active Integrations" : "Mock Telemetries Enabled"}
                  </span>
                </div>
              </div>

              {/* IP restriction field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Authorized CIDR IP Ranges</label>
                <input
                  type="text"
                  value={ipRestrictions}
                  onChange={(e) => setIpRestrictions(e.target.value)}
                  placeholder="e.g. 10.0.0.0/8"
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                />
                <span className="text-[9px] text-gray-500 block">Comma separated list of IP addresses allowed to push trace parameters.</span>
              </div>

              {/* Security toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-gray-200 block">Require MFA for Deletion</span>
                    <span className="text-[10px] text-gray-500">Auto locks critical trace pruning.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={mfaEnabled}
                    onChange={(e) => setMfaEnabled(e.target.checked)}
                    className="h-4 w-4 bg-gray-950 border-gray-850 rounded"
                  />
                </div>
                <div className="p-4 bg-[#111827] rounded-xl border border-gray-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-gray-200 block">Strict Audit Trails</span>
                    <span className="text-[10px] text-gray-500">Log all manual search requests.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={auditLogging}
                    onChange={(e) => setAuditLogging(e.target.checked)}
                    className="h-4 w-4 bg-gray-950 border-gray-850 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6 max-w-2xl animate-slide-in">
            <div>
              <h3 className="text-base font-bold font-display text-white">Alerting & Incident Integrations</h3>
              <p className="text-xs text-gray-400 mt-1">Configure external alert webhooks, incident management keys, and notification thresholds.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Slack Incoming Webhook URL</label>
                <input
                  type="text"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">PagerDuty Integration Key</label>
                <input
                  type="password"
                  value={pagerDutyKey}
                  onChange={(e) => setPagerDutyKey(e.target.value)}
                  className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold block">Incident Dispatch Severity</label>
                <div className="flex gap-2 text-xs font-mono">
                  {(["all", "errors", "critical"] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setAlertSeverity(sev)}
                      className={`px-3 py-1.5 rounded-lg border text-[10px] uppercase font-bold tracking-wider transition-colors ${
                        alertSeverity === sev
                          ? "bg-red-950/20 text-red-400 border-red-900/40"
                          : "bg-gray-900/40 text-gray-400 border-gray-850 hover:text-white"
                      }`}
                    >
                      {sev === "all" ? "Every Event" : sev === "errors" ? "Warnings & Aborts" : "Critical Core Only"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-6 max-w-2xl animate-slide-in">
            <div>
              <h3 className="text-base font-bold font-display text-white">Storage & Data Retention</h3>
              <p className="text-xs text-gray-400 mt-1">Configure persistent cache log durations, regional constraints, and automated data pruning guides.</p>
            </div>

            <div className="space-y-5">
              {/* Slider for Retention Days */}
              <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-gray-200">Log Retention Duration</span>
                  <span className="text-blue-400 font-mono font-bold">{retentionDays} Working Days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="180"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-850 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500">
                  <span>7 Days (Prudent)</span>
                  <span>90 Days (Corporate Standard)</span>
                  <span>180 Days (PCI Compliance Limit)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase font-bold">Storage Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-[#111827] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500 text-white font-medium"
                  >
                    <option value="us-central1">United States (us-central1)</option>
                    <option value="europe-west3">Europe Frankfurt (europe-west3)</option>
                    <option value="asia-east1">Asia Pacific (asia-east1)</option>
                  </select>
                </div>

                <div className="p-4 bg-[#111827] border border-gray-800 rounded-xl flex items-center justify-between h-[66px] mt-5.5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-gray-200 block">Automated Log Pruning</span>
                    <span className="text-[10px] text-gray-500">Prune caches on limits.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPruning}
                    onChange={(e) => setAutoPruning(e.target.checked)}
                    className="h-4 w-4 bg-gray-950 border-gray-850 rounded"
                  />
                </div>
              </div>

              <div className="p-4 bg-red-950/10 border border-red-900/20 rounded-xl flex gap-3 text-xs leading-relaxed text-gray-400">
                <Trash2 className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className="font-semibold text-red-400">Manual Cluster Cache Wipe</span>
                  <p className="text-[11px]">Clicking manual purge will clear all local session storage histories instantly. This action is absolutely irreversible.</p>
                  <button
                    onClick={() => {
                      if (confirm("Irreversibly wipe all telemetry histories?")) {
                        localStorage.removeItem("agentops_sessions");
                        window.location.reload();
                      }
                    }}
                    className="mt-2.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-950/80 border border-red-900/30 text-[10px] font-mono font-bold uppercase text-red-400 rounded-lg transition-colors"
                  >
                    Purge Caches Instantly
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
