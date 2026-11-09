import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import {
  BookOpen,
  Printer,
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  AlignLeft,
  List,
  Sparkles,
  ShieldCheck,
  Clock,
  FileCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark
} from 'lucide-react';
import { ParsedPaper, MANDATORY_SECTIONS } from '../types/paper.ts';
import { CitationInspector } from './CitationInspector.tsx';

interface PaperViewerProps {
  paper: ParsedPaper;
  onOpenExport: () => void;
  onPrint: () => void;
  isStreaming?: boolean;
}

export const PaperViewer: React.FC<PaperViewerProps> = ({
  paper,
  onOpenExport,
  onPrint,
  isStreaming = false,
}) => {
  const [activeTab, setActiveTab] = useState<'manuscript' | 'section-by-section' | 'citations' | 'raw'>('manuscript');
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<number>(1);
  const [typography, setTypography] = useState<'serif' | 'sans'>('serif');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copiedFull, setCopiedFull] = useState(false);

  // Configure marked safely
  const renderedHtml = useMemo(() => {
    if (!paper.rawMarkdown) return '';
    try {
      return marked.parse(paper.rawMarkdown, {
        gfm: true,
        breaks: true,
      }) as string;
    } catch (e) {
      return paper.rawMarkdown;
    }
  }, [paper.rawMarkdown]);

  const handleCopyFull = () => {
    navigator.clipboard.writeText(paper.rawMarkdown);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const scrollToSection = (secNumber: number) => {
    setSelectedSectionNumber(secNumber);
    if (activeTab !== 'manuscript') {
      setActiveTab('manuscript');
    }
    setTimeout(() => {
      const el = document.getElementById(`section-${secNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const selectedSection = paper.sections.find((s) => s.number === selectedSectionNumber) || paper.sections[0];

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  }[fontSize];

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        {/* Left: View Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('manuscript')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
              activeTab === 'manuscript'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Full Manuscript
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('section-by-section')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
              activeTab === 'section-by-section'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <List className="w-3.5 h-3.5 mr-1.5" />
            Section Focus
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
              activeTab === 'citations'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
            Citations ({paper.references.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
              activeTab === 'raw'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Raw Markdown
          </button>
        </div>

        {/* Right: Customization & Actions */}
        <div className="flex items-center space-x-2">
          {/* Typography Selector */}
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setTypography('serif')}
              className={`px-2 py-1 rounded transition-colors ${
                typography === 'serif' ? 'bg-white text-slate-900 shadow-2xs font-serif font-bold' : 'hover:text-slate-900'
              }`}
              title="Serif Academic Font (Lora)"
            >
              Academic
            </button>
            <button
              type="button"
              onClick={() => setTypography('sans')}
              className={`px-2 py-1 rounded transition-colors ${
                typography === 'sans' ? 'bg-white text-slate-900 shadow-2xs font-sans font-bold' : 'hover:text-slate-900'
              }`}
              title="Modern Sans Font (Inter)"
            >
              Modern
            </button>
          </div>

          {/* Font Size Zoom */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded ${fontSize === 'sm' ? 'bg-white font-bold text-slate-900' : ''}`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded ${fontSize === 'base' ? 'bg-white font-bold text-slate-900' : ''}`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded ${fontSize === 'lg' ? 'bg-white font-bold text-slate-900' : ''}`}
            >
              A+
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Copy Full */}
          <button
            type="button"
            onClick={handleCopyFull}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Copy entire markdown paper"
          >
            {copiedFull ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy
              </>
            )}
          </button>

          {/* Export Modal */}
          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export
          </button>

          {/* Print PDF */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 mr-1" />
            PDF / Print
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'citations' ? (
        <CitationInspector
          references={paper.references}
          rawReferencesText={paper.sections.find((s) => s.number === 9)?.content}
        />
      ) : activeTab === 'raw' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 text-xs text-slate-500">
            <span>Raw Markdown Output</span>
            <span>{paper.wordCount.toLocaleString()} words</span>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-inner">
            {paper.rawMarkdown}
          </pre>
        </div>
      ) : activeTab === 'section-by-section' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Selector Sidebar */}
          <div className="lg:col-span-1 space-y-1.5 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sections
            </div>
            {MANDATORY_SECTIONS.map((sec) => {
              const secData = paper.sections.find((s) => s.number === sec.number);
              const isSelected = selectedSectionNumber === sec.number;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedSectionNumber(sec.number)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="line-clamp-1">
                    {sec.number}. {sec.shortTitle}
                  </span>
                  <span
                    className={`text-[10px] ml-2 ${
                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {secData?.wordCount || 0}w
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content Card */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="pb-4 mb-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Section {selectedSection?.number} of 9
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2 font-serif-academic">
                  {selectedSection?.title}
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                {selectedSection?.wordCount || 0} words
              </span>
            </div>

            <div
              className={`prose prose-slate max-w-none ${fontSizeClass} ${
                typography === 'serif' ? 'font-serif-academic' : 'font-sans'
              }`}
              dangerouslySetInnerHTML={{
                __html: marked.parse(selectedSection?.content || '*No content available for this section.*') as string,
              }}
            />

            {/* Navigation buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={selectedSectionNumber <= 1}
                onClick={() => setSelectedSectionNumber((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
              >
                &larr; Previous Section
              </button>

              <button
                type="button"
                disabled={selectedSectionNumber >= 9}
                onClick={() => setSelectedSectionNumber((prev) => Math.min(9, prev + 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
              >
                Next Section &rarr;
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Full Manuscript View with Sticky Table of Contents */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Table of Contents Outline (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-20 space-y-3 no-print">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                <span>Table of Contents</span>
              </div>
              <nav className="space-y-1">
                {MANDATORY_SECTIONS.map((sec) => {
                  const secData = paper.sections.find((s) => s.number === sec.number);
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.number)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-indigo-900 hover:bg-indigo-50/70 transition-colors flex items-center justify-between group"
                    >
                      <span className="line-clamp-1 group-hover:translate-x-0.5 transition-transform">
                        {sec.number}. {sec.shortTitle}
                      </span>
                      {secData?.wordCount ? (
                        <span className="text-[10px] text-slate-400 group-hover:text-indigo-600">
                          {secData.wordCount}w
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Total Words:</span>
                  <span className="font-semibold text-slate-700">{paper.wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reading Time:</span>
                  <span className="font-semibold text-slate-700">{paper.readingTimeMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Sources:</span>
                  <span className="font-semibold text-emerald-600">{paper.references.length} papers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Manuscript Document */}
          <div className="lg:col-span-3">
            <article
              className={`paper-manuscript bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-md transition-all ${
                typography === 'serif' ? 'font-serif-academic' : 'font-sans'
              }`}
            >
              {/* Journal / Manuscript Banner */}
              <div className="border-b-2 border-slate-900 pb-8 mb-10">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">
                  <span>ScholarForge Academic Manuscript</span>
                  <span>Peer-Reviewed Structure &middot; 9 Sections</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight font-serif-academic mb-4">
                  {paper.title}
                </h1>

                {/* Author Metadata */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 font-sans pt-2">
                  <div className="font-medium text-slate-800">
                    ScholarForge Research Agent
                  </div>
                  <span className="text-slate-300">&bull;</span>
                  <div className="flex items-center text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full font-semibold">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Gemini AI Few-Shot Engine
                  </div>
                  {paper.discipline && (
                    <>
                      <span className="text-slate-300">&bull;</span>
                      <div className="text-slate-600 font-medium">{paper.discipline}</div>
                    </>
                  )}
                  <span className="text-slate-300">&bull;</span>
                  <div className="text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {paper.readingTimeMinutes} min read ({paper.wordCount.toLocaleString()} words)
                  </div>
                </div>
              </div>

              {/* Document Body */}
              <div className="space-y-12">
                {paper.sections.map((sec) => (
                  <section
                    key={sec.id}
                    id={`section-${sec.number}`}
                    className="scroll-mt-24 pt-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-serif-academic">
                        {sec.number}. {sec.title}
                      </h2>
                      <span className="text-xs font-mono text-slate-400 font-sans no-print">
                        {sec.wordCount} words
                      </span>
                    </div>

                    <div
                      className={`prose prose-slate max-w-none ${fontSizeClass} prose-headings:font-serif-academic prose-p:leading-relaxed prose-li:leading-relaxed text-slate-800`}
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(sec.content || '') as string,
                      }}
                    />
                  </section>
                ))}
              </div>

              {/* Streaming Indicator */}
              {isStreaming && (
                <div className="mt-8 p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-800 flex items-center space-x-3 animate-pulse no-print font-sans">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                  <span className="text-xs font-semibold">
                    Gemini AI is actively authoring the manuscript...
                  </span>
                </div>
              )}

              {/* Manuscript Footer */}
              <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-3">
                <span>
                  Generated on {new Date(paper.generatedAt).toLocaleDateString()} &middot; Verifiable academic citations
                </span>
                <div className="flex items-center space-x-2 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Real Peer-Reviewed Literature Verification Standard</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
};
