import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Code2, Printer } from 'lucide-react';
import { ParsedPaper } from '../types/paper.ts';
import { generateBibTeX, generateLaTeX } from '../utils/paperParser.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: ParsedPaper;
  onPrint: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  paper,
  onPrint,
}) => {
  const [activeFormat, setActiveFormat] = useState<'markdown' | 'latex' | 'bibtex'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const contentMap = {
    markdown: paper.rawMarkdown,
    latex: generateLaTeX(paper),
    bibtex: generateBibTeX(paper),
  };

  const currentContent = contentMap[activeFormat];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filenameBase = paper.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40) || 'research-paper';

    const extMap = {
      markdown: 'md',
      latex: 'tex',
      bibtex: 'bib',
    };

    const mimeMap = {
      markdown: 'text/markdown',
      latex: 'application/x-latex',
      bibtex: 'application/x-bibtex',
    };

    const blob = new Blob([currentContent], { type: mimeMap[activeFormat] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameBase}.${extMap[activeFormat]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Export Academic Manuscript
            </h2>
            <p className="text-xs text-slate-500">
              Download or copy formatted research in Markdown, LaTeX, or BibTeX
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveFormat('markdown')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeFormat === 'markdown'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Markdown (.md)
            </button>

            <button
              type="button"
              onClick={() => setActiveFormat('latex')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeFormat === 'latex'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              LaTeX (.tex)
            </button>

            <button
              type="button"
              onClick={() => setActiveFormat('bibtex')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeFormat === 'bibtex'
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              BibTeX References (.bib)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onPrint();
            }}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Print / PDF
          </button>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40">
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto shadow-inner">
            {currentContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {paper.wordCount.toLocaleString()} words &middot; {paper.references.length} references
          </span>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy to Clipboard
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
