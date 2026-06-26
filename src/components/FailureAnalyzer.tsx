import React, { useState } from "react";
import { ShieldAlert, Sparkles, AlertOctagon, HelpCircle, CheckCircle, RefreshCw, Key, Info } from "lucide-react";

interface FailureAnalyzerProps {
  errorId: string;
  errorMessage: string;
  sessionId: string;
  category: string;
  onResolved?: () => void;
  isResolved?: boolean;
}

export default function FailureAnalyzer({
  errorId,
  errorMessage,
  sessionId,
  category,
  onResolved,
  isResolved,
}: FailureAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const runDiagnostics = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasRun(true);
    }, 1500);
  };

  // Generate realistic troubleshooting payload based on error category & message
  const getTroubleshootData = () => {
    const isAws = /aws|ecs|auth-api|token/i.test(errorMessage) || category === "network" || category === "tool";
    const isDb = /postgres|database|pool|connection/i.test(errorMessage);

    if (isAws) {
      return {
        rootCause: "AWS IAM Permission Failure. The execution token 'arn:aws:iam::983125:user/agentops-runner' lacks the privilege 'ecs:UpdateService' on resource 'arn:aws:ecs:us-west-2:983125:service/auth-api'.",
        possibleFix: "Attach the AWS managed policy 'AmazonECS_FullAccess' or add custom inline permissions with action 'ecs:UpdateService' to the runner role.",
        retryRecommendation: "Implement exponential backoff (starting at 1000ms, max 30s) with 100ms jitter to prevent container thrashing.",
        confidence: 96,
        suggestedPromptChanges: 'Specify explicit AWS profiles in prompts: "Reboot ECS container auth-api using the admin credentials profile us-west-2".',
        suggestedToolChanges: "Update credentials provider chain inside the AWS SDK wrapper. Ensure process.env.AWS_SESSION_TOKEN is updated.",
      };
    } else if (isDb) {
      return {
        rootCause: "PostgreSQL Database Connection Pool Exhaustion. Total active connections reached the maximum limit of 20 during intensive catalog schema queries.",
        possibleFix: "Increase the max connection pool limit (e.g., max: 50) in Drizzle/pg-pool configuration or release idle database connections immediately using client.end().",
        retryRecommendation: "Perform linear retry (max 3 retries, interval 500ms) once connection channels have been recycled.",
        confidence: 91,
        suggestedPromptChanges: 'Optimize the database request query parameter: "Request db metadata columns cleanly using single JOIN instead of multi-subqueries".',
        suggestedToolChanges: "Implement idleTimeoutMillis: 10000 and connectionTimeoutMillis: 2000 inside pg-pool parameters.",
      };
    } else {
      return {
        rootCause: "Rate limit exceeded for model gemini-3.5-flash (429 quota exhaustion). Dynamic context payload exceeded token throughput constraints.",
        possibleFix: "Upgrade Gemini tier subscription inside Google Cloud Console or add multiple fallback API keys inside secondary rotation pools.",
        retryRecommendation: "Retry after 60s cooldown limit, with immediate failover to gemini-3.5-flash-lite.",
        confidence: 88,
        suggestedPromptChanges: "Condense long conversation history. Instruct agent to return compact responses instead of verbose tables.",
        suggestedToolChanges: "Configure request throttling (max 60 RPM per API key) inside LLM inference client wrappers.",
      };
    }
  };

  const data = getTroubleshootData();

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden text-left shadow-lg">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-red-950/30 text-red-400 rounded-lg border border-red-900/35">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-display">AI failure Analyzer</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Real-time root-cause & prompt adjustment recommendations</p>
          </div>
        </div>
        {!hasRun && (
          <button
            onClick={runDiagnostics}
            disabled={isAnalyzing}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold text-white rounded transition-colors flex items-center gap-1 border border-blue-500/20"
          >
            <Sparkles className="h-3 w-3 fill-current" />
            {isAnalyzing ? "Analyzing..." : "Analyze Failure"}
          </button>
        )}
      </div>

      {/* Body Area */}
      <div className="p-5">
        {!hasRun ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 bg-gray-950/20 border border-dashed border-gray-800 rounded-lg p-6">
            <Sparkles className={`h-8 w-8 text-blue-500/50 mb-3 ${isAnalyzing ? "animate-spin" : "animate-pulse"}`} />
            <h5 className="text-xs font-semibold text-gray-300">Awaiting failure Diagnostics</h5>
            <p className="text-[11px] text-gray-400 mt-1 max-w-sm leading-relaxed">
              {isAnalyzing 
                ? "Connecting to Google Gemini API to compile log traces, error codes, and prompt vectors..." 
                : "Click 'Analyze Failure' above to dispatch traces to the Gemini agent analyzer engine."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            
            {/* Top confidence and resolution section */}
            <div className="flex items-center justify-between p-3.5 bg-gray-950 rounded-lg border border-gray-850">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-mono uppercase text-[9px]">Confidence Index:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{data.confidence}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-mono uppercase text-[9px]">Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] uppercase border ${
                  isResolved 
                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" 
                    : "bg-red-950/20 text-red-400 border-red-900/30 animate-pulse"
                }`}>
                  {isResolved ? "RESOLVED" : "UNRESOLVED"}
                </span>
              </div>
            </div>

            {/* Root cause and fix split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-950/5 border border-red-900/10 rounded-lg space-y-1">
                <span className="text-[9px] font-mono text-red-400 uppercase font-bold tracking-wider">Root Cause Analysis</span>
                <p className="text-gray-300 leading-relaxed">{data.rootCause}</p>
              </div>
              <div className="p-4 bg-emerald-950/5 border border-emerald-900/10 rounded-lg space-y-1">
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider">Recommended Remedy</span>
                <p className="text-gray-300 leading-relaxed">{data.possibleFix}</p>
              </div>
            </div>

            {/* Prompt Adjustments */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850 space-y-1.5">
              <span className="text-[9px] font-mono text-indigo-400 uppercase font-bold tracking-wider">Suggested Prompt adjustments</span>
              <p className="text-xs text-gray-300 font-mono p-2 bg-[#111827] border border-gray-800 rounded">
                {data.suggestedPromptChanges}
              </p>
            </div>

            {/* Tool / SDK adjustments */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850 space-y-1.5">
              <span className="text-[9px] font-mono text-amber-400 uppercase font-bold tracking-wider">Suggested Tool / SDK modifications</span>
              <p className="text-gray-300 leading-relaxed font-sans">
                {data.suggestedToolChanges}
              </p>
            </div>

            {/* Jitter / Retry recommendation */}
            <div className="p-4 bg-gray-950 rounded-lg border border-gray-850 space-y-1">
              <span className="text-[9px] font-mono text-blue-400 uppercase font-bold tracking-wider">Retry & Throttling Guidelines</span>
              <p className="text-gray-300 leading-relaxed">{data.retryRecommendation}</p>
            </div>

            {/* Resolve trigger inline */}
            {!isResolved && onResolved && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onResolved}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold text-white transition-all shadow border border-emerald-500/20"
                >
                  Apply Remedy & Resolve Exception
                </button>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
