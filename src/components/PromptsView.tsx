import React from "react";
import { 
  FileInput, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight, 
  Copy, 
  ArrowDown, 
  Activity, 
  Code2, 
  Sparkles,
  Layers
} from "lucide-react";
import { AgentSession } from "../types";

interface PromptsViewProps {
  sessions: AgentSession[];
  selectedSession: AgentSession | null;
}

export default function PromptsView({ sessions, selectedSession }: PromptsViewProps) {
  
  const activeSession = selectedSession || sessions[0];

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0B0F14] text-gray-400 text-center space-y-4">
        <div className="relative">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl blur opacity-15"></div>
          <div className="h-16 w-16 bg-gray-950 border border-gray-800/80 rounded-2xl flex items-center justify-center text-blue-500 shadow-2xl relative mx-auto">
            <FileInput className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Prompt Pipelines Empty</h3>
          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
            No compiled system instructions or raw prompt pipelines are currently loaded. Please execute a model run or select an active session to inspect prompt hydration.
          </p>
        </div>
      </div>
    );
  }

  // Helper copy function
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            PROMPT OPTIMIZER
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">Prompt Pipeline Inspector</h2>
          <p className="text-xs text-gray-400 mt-1">
            Comparing pre-processing layers for session: <span className="font-mono text-blue-400 font-semibold">{activeSession.id}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-gray-400 bg-gray-900 px-3 py-1.5 rounded border border-gray-800">
          <span>Scale: {Math.round(activeSession.prompts.final.length / activeSession.prompts.original.length)}x expansion</span>
        </div>
      </div>

      {/* Grid: 3 Prompt Layers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* original prompt */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Layer 1: Raw Query</span>
              <span className="text-[10px] font-mono text-blue-400">{activeSession.prompts.original.length} chars</span>
            </div>
            <h3 className="text-sm font-semibold text-white font-display">Original User Prompt</h3>
            <p className="text-xs text-gray-400">Captured raw developer input before compilation or safety wrapping.</p>
          </div>
          <div className="bg-gray-950 p-4 rounded-lg border border-gray-850 font-mono text-xs text-blue-300 min-h-[220px] relative">
            <p className="whitespace-pre-wrap leading-relaxed">"{activeSession.prompts.original}"</p>
            <button 
              onClick={() => handleCopy(activeSession.prompts.original)}
              className="absolute bottom-3 right-3 p-1.5 bg-[#111827] hover:bg-gray-800 border border-gray-800 rounded text-gray-400 hover:text-white transition-colors"
              title="Copy prompt"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* expanded prompt */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Layer 2: Context Wrapper</span>
              <span className="text-[10px] font-mono text-indigo-400">{activeSession.prompts.expanded.length} chars</span>
            </div>
            <h3 className="text-sm font-semibold text-white font-display">System Instructions Added</h3>
            <p className="text-xs text-gray-400">Expanded with prompt policies, role personas and catalog boundaries.</p>
          </div>
          <div className="bg-gray-950 p-4 rounded-lg border border-gray-850 font-mono text-xs text-indigo-300 min-h-[220px] relative">
            <p className="whitespace-pre-wrap leading-relaxed">{activeSession.prompts.expanded}</p>
            <button 
              onClick={() => handleCopy(activeSession.prompts.expanded)}
              className="absolute bottom-3 right-3 p-1.5 bg-[#111827] hover:bg-gray-800 border border-gray-800 rounded text-gray-400 hover:text-white transition-colors"
              title="Copy prompt"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* final prompt */}
        <div className="bg-[#111827] border border-gray-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Layer 3: Target Inference Frame</span>
              <span className="text-[10px] font-mono text-teal-400">{activeSession.prompts.final.length} chars</span>
            </div>
            <h3 className="text-sm font-semibold text-white font-display">Final Compiled Context</h3>
            <p className="text-xs text-gray-400">Fully hydrated with fetched memories and tool return structures.</p>
          </div>
          <div className="bg-gray-950 p-4 rounded-lg border border-gray-850 font-mono text-xs text-emerald-300 min-h-[220px] relative">
            <p className="whitespace-pre-wrap leading-relaxed">{activeSession.prompts.final}</p>
            <button 
              onClick={() => handleCopy(activeSession.prompts.final)}
              className="absolute bottom-3 right-3 p-1.5 bg-[#111827] hover:bg-gray-800 border border-gray-800 rounded text-gray-400 hover:text-white transition-colors"
              title="Copy prompt"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Visual map */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <div>
            <h4 className="text-sm font-semibold text-white font-display">Context Engineering Flow</h4>
            <p className="text-xs text-gray-400 font-sans mt-0.5">Hydration of system memories prevents LLM hallucination.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 select-none">
          <span className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded text-blue-400">Raw Input</span>
          <ArrowRight className="h-4 w-4 text-gray-600" />
          <span className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded text-indigo-400">Instruction Wrap</span>
          <ArrowRight className="h-4 w-4 text-gray-600" />
          <span className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded text-teal-400">RAG Context Load</span>
          <ArrowRight className="h-4 w-4 text-emerald-500" />
          <span className="px-3 py-1.5 bg-emerald-950/20 border border-emerald-900 text-emerald-400 font-bold uppercase">Gemini</span>
        </div>
      </div>

    </div>
  );
}
