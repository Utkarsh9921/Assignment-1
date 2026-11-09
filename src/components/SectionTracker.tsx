import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { MANDATORY_SECTIONS, ParsedPaper } from '../types/paper.ts';

interface SectionTrackerProps {
  paper: ParsedPaper | null;
  isGenerating: boolean;
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
}

export const SectionTracker: React.FC<SectionTrackerProps> = ({
  paper,
  isGenerating,
  activeSectionId,
  onSelectSection,
}) => {
  return (
    <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 no-print">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          9-Section Academic Architecture
        </span>
        <span className="text-xs font-medium text-slate-500">
          {paper?.sections.filter((s) => s.content.length > 50).length || 0} of 9 Complete
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1.5 sm:gap-2">
        {MANDATORY_SECTIONS.map((sec) => {
          const sectionData = paper?.sections.find((s) => s.number === sec.number);
          const hasContent = Boolean(sectionData && sectionData.content.length > 40);
          const isCurrentlyActive = activeSectionId === sec.id;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection?.(sec.id)}
              disabled={!hasContent && !isGenerating}
              className={`flex flex-col items-start p-2 rounded-lg text-left transition-all text-xs border ${
                isCurrentlyActive
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-300'
                  : hasContent
                  ? 'bg-white hover:bg-indigo-50/70 text-slate-800 border-slate-200/80 hover:border-indigo-300'
                  : 'bg-slate-100/70 text-slate-400 border-slate-200/40 opacity-70 cursor-default'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isCurrentlyActive
                      ? 'bg-indigo-500 text-white'
                      : hasContent
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  §{sec.number}
                </span>

                {isGenerating && !hasContent && isCurrentlyActive ? (
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                ) : hasContent ? (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isCurrentlyActive ? 'text-white' : 'text-emerald-500'
                    }`}
                  />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>

              <span className="font-semibold line-clamp-1 text-[11px] leading-tight">
                {sec.shortTitle}
              </span>

              {hasContent && (
                <span
                  className={`text-[9px] mt-0.5 ${
                    isCurrentlyActive ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  {sectionData?.wordCount || 0} w
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
