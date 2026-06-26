import React, { useState } from "react";
import { 
  Database, 
  HelpCircle, 
  ChevronRight, 
  BookOpen, 
  Terminal, 
  ArrowRight, 
  Activity,
  History,
  Tag
} from "lucide-react";
import { AgentSession } from "../types";

interface MemoryViewProps {
  sessions: AgentSession[];
  selectedSession: AgentSession | null;
}

export default function MemoryView({ sessions, selectedSession }: MemoryViewProps) {
  
  const activeSession = selectedSession || sessions[0];
  const [expandedSection, setExpandedSection] = useState<string>("context");

  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0B0F14] text-gray-500 text-center font-mono">
        <Activity className="h-10 w-10 text-gray-800 mb-3" />
        <p className="text-xs">No active memory snapshots loaded in system cache.</p>
      </div>
    );
  }

  const memorySections = [
    {
      id: "context",
      title: "Conversation Context Frame",
      subtitle: "The high-level active conversational boundary.",
      content: activeSession.memory.context,
      icon: Terminal,
    },
    {
      id: "docs",
      title: "Retrieved Knowledge Documents",
      subtitle: "Vector chunks injected during the RAG pipeline step.",
      items: activeSession.memory.retrievedDocs,
      icon: BookOpen,
    },
    {
      id: "sources",
      title: "Knowledge Base Sources",
      subtitle: "Semantic indexes and databases consulted.",
      items: activeSession.memory.knowledgeSources,
      icon: Database,
    },
    {
      id: "references",
      title: "Memory Graph References",
      subtitle: "Cross-session memory graphs matched for personalized execution.",
      items: activeSession.memory.memoryReferences,
      icon: Tag,
    },
    {
      id: "sessionMemory",
      title: "Updated Session Memory State",
      subtitle: "The state serialized and saved for future loops.",
      content: activeSession.memory.sessionMemory,
      icon: History,
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0B0F14] text-gray-200 space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">
            EPISODIC STORAGE
          </span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">Memory Inspector</h2>
          <p className="text-xs text-gray-400 mt-1">
            Auditing dynamic context memory, retrieved vector nodes, and memory-graph nodes for session: <span className="font-mono text-blue-400 font-semibold">{activeSession.id}</span>
          </p>
        </div>
        <div className="text-right text-xs font-mono text-gray-400 bg-gray-900 px-3 py-1.5 rounded border border-gray-800">
          <span>Vectors: {activeSession.memory.retrievedDocs.length + activeSession.memory.knowledgeSources.length} slots loaded</span>
        </div>
      </div>

      {/* Query summary */}
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 text-xs font-mono text-gray-400 flex items-center gap-2">
        <span className="text-gray-500 shrink-0 uppercase text-[9px]">Scope Target:</span>
        <span className="text-gray-300 truncate font-semibold">"{activeSession.query}"</span>
      </div>

      {/* Expandable panels */}
      <div className="space-y-4">
        {memorySections.map((sec) => {
          const Icon = sec.icon;
          const isExpanded = expandedSection === sec.id;
          
          return (
            <div 
              key={sec.id} 
              className={`bg-[#111827] border ${isExpanded ? "border-blue-500/50 shadow-md shadow-blue-950/10" : "border-gray-800 hover:border-gray-700"} rounded-xl transition-all overflow-hidden`}
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? "" : sec.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-2 rounded-lg border ${isExpanded ? "bg-blue-950/20 text-blue-400 border-blue-900/40" : "bg-gray-950 text-gray-500 border-gray-800"}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white font-display">{sec.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{sec.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90 text-blue-400" : ""}`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1.5 border-t border-gray-800/50 bg-gray-950/30 text-xs font-mono text-gray-300 space-y-2">
                  {sec.content && (
                    <div className="p-4 bg-gray-950 rounded-lg border border-gray-850 text-gray-300 leading-relaxed font-sans">
                      {sec.content}
                    </div>
                  )}

                  {sec.items && sec.items.length > 0 && (
                    <div className="space-y-2">
                      {sec.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start p-3.5 bg-gray-950 rounded-lg border border-gray-850">
                          <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="text-gray-300 font-sans leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.items && sec.items.length === 0 && (
                    <p className="text-xs text-gray-500 italic p-3 font-sans">No records mapped.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
