import React, { useState } from 'react';
import { X, Copy, Check, FileText, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface FewShotModalProps {
  isOpen: boolean;
  onClose: () => void;
  examples: Array<{ id: string; title: string; discipline: string; content: string }>;
}

export const FewShotModal: React.FC<FewShotModalProps> = ({
  isOpen,
  onClose,
  examples,
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'ex1' | 'ex2'>('system');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentContent =
    activeTab === 'system'
      ? `SYSTEM INSTRUCTION:
You are ScholarForge, an elite academic research assistant and scientific paper authoring agent.
Your objective is to generate rigorous, graduate-level academic research paper manuscripts based on a user's specified research topic.

You MUST structure every research paper strictly into the following nine numbered sections:
1. Research Topic Overview
2. Problem Statement
3. Research Objectives
4. Research Questions
5. Literature Review
6. Research Methodology
7. Research Gaps
8. Conclusion
9. References

CRITICAL RULES FOR CITATIONS & REFERENCES:
- DO NOT FABRICATE, INVENT, OR HALLUCINATE REFERENCES OR CITATIONS.
- Every reference in Section 9 MUST be a real, verifiable, peer-reviewed academic publication, foundational book, or notable arXiv preprint from legitimate authors and recognized venues.
- Citations in the body of the paper must precisely match the real entries listed in Section 9 using academic citation format.
- Provide complete bibliographic details in Section 9: Authors, Year, Title, Journal/Conference/Source, Volume/Issue/Pages or DOI/arXiv ID where applicable.`
      : activeTab === 'ex1'
      ? examples[0]?.content || ''
      : examples[1]?.content || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Few-Shot Prompt & Agent Architecture
              </h2>
              <p className="text-xs text-slate-500">
                Two complete input-output exemplars conditioning Gemini AI for rigorous academic structure
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy Text
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex space-x-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'system'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            System Instructions & Rules
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ex1')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ex1'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Exemplar 1 (LLMs & RAG)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ex2')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ex2'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Exemplar 2 (Federated Medical AI)
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Prompting Protocol:</span> This agent applies in-context few-shot learning to enforce the 9 mandatory sections and zero hallucination of citations. The system prompt below is executed alongside two comprehensive graduate-level example manuscripts.
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
                {currentContent}
              </pre>
            </div>
          )}

          {(activeTab === 'ex1' || activeTab === 'ex2') && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between">
                <span>
                  <strong>Full Exemplar In-Context Pair:</strong> Included in the prompt payload sent to Gemini AI so the model mirrors exact academic depth, numbered objectives, and real citation standards.
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-xs overflow-x-auto">
                {currentContent}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Model: <code>gemini-3.8-flash</code> via <code>@google/genai</code> SDK</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
