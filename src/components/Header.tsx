import React from 'react';
import { BookOpen, Sparkles, FileCode, CheckCircle2, Award } from 'lucide-react';

interface HeaderProps {
  onOpenFewShotModal: () => void;
  onSelectExample: (exampleId: string) => void;
  examples: Array<{ id: string; title: string; discipline: string }>;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFewShotModal,
  onSelectExample,
  examples,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 flex items-center justify-center text-white shadow-md shadow-slate-900/10 ring-1 ring-slate-800/20">
            <BookOpen className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-title text-lg font-bold tracking-tight text-slate-900">
                ScholarForge
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 mr-1 text-indigo-500" />
                Research Paper Agent
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Structured 9-Section Academic Generator Powered by Gemini AI
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Example manuscripts dropdown */}
          <div className="relative group hidden md:block">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <Award className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Example Papers
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block hover:block z-40">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Few-Shot Exemplars
              </div>
              {examples.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelectExample(ex.id)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition-colors flex flex-col"
                >
                  <span className="font-medium line-clamp-1">{ex.title}</span>
                  <span className="text-[10px] text-slate-400">{ex.discipline}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Few-Shot Methodology Modal Trigger */}
          <button
            type="button"
            onClick={onOpenFewShotModal}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/80"
            title="Inspect system prompt & few-shot examples"
          >
            <FileCode className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            <span className="hidden sm:inline">Few-Shot Prompt</span>
            <span className="sm:hidden">Prompt</span>
          </button>

          {/* Model Status Badge */}
          <div className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            <span className="hidden sm:inline font-mono text-[11px]">gemini-3.8-flash</span>
            <span className="sm:hidden text-[11px]">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
