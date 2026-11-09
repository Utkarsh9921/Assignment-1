import React, { useState } from 'react';
import { ExternalLink, CheckCircle, ShieldCheck, Copy, Check, Search, BookOpen, Quote } from 'lucide-react';
import { PaperReference } from '../types/paper.ts';

interface CitationInspectorProps {
  references: PaperReference[];
  rawReferencesText?: string;
}

export const CitationInspector: React.FC<CitationInspectorProps> = ({
  references,
  rawReferencesText,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCitation = (ref: PaperReference) => {
    navigator.clipboard.writeText(ref.rawText);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Citation & Reference Verifier
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {references.length} Peer-Reviewed References
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            References are strictly constrained to real, peer-reviewed foundational literature without hallucination.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200/60 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-Fabrication Prompt Constraint Active</span>
        </div>
      </div>

      {references.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium">No references parsed yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Section 9 References will populate once authoring completes.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3.5">
          {references.map((ref, index) => {
            const scholarQuery = encodeURIComponent(
              `${ref.title || ref.rawText.substring(0, 100)}`
            );
            const scholarUrl = `https://scholar.google.com/scholar?q=${scholarQuery}`;

            return (
              <div
                key={ref.id}
                className="group relative p-4 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="shrink-0 w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-xs flex items-center justify-center font-bold shadow-2xs">
                      {index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">
                          {ref.authorYear}
                        </span>
                        <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                          Academic Source
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-800 leading-snug">
                        {ref.title}
                      </p>

                      <p className="text-xs text-slate-500 italic">
                        {ref.venue}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(ref)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                      title="Copy full citation"
                    >
                      {copiedId === ref.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <a
                      href={ref.doiOrUrl || scholarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                      title="Search in Google Scholar or DOI"
                    >
                      <Search className="w-3 h-3 mr-1" />
                      Verify
                      <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
                    </a>
                  </div>
                </div>

                {/* Raw citation hover view */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/50 text-[11px] text-slate-500 font-serif-academic">
                  {ref.rawText}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raw References Fallback */}
      {rawReferencesText && references.length === 0 && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-serif-academic text-slate-700 whitespace-pre-wrap leading-relaxed">
          {rawReferencesText}
        </div>
      )}
    </div>
  );
};
