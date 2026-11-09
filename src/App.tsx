/**
 * ScholarForge - Research Paper Agent
 * Powered by Gemini AI with Few-Shot Prompting
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { TopicInput } from './components/TopicInput.tsx';
import { SectionTracker } from './components/SectionTracker.tsx';
import { PaperViewer } from './components/PaperViewer.tsx';
import { FewShotModal } from './components/FewShotModal.tsx';
import { ExportModal } from './components/ExportModal.tsx';
import { ParsedPaper, FewShotExample, SampleTopic } from './types/paper.ts';
import { parsePaperMarkdown } from './utils/paperParser.ts';
import { AlertCircle, Sparkles, BookOpen, Layers, CheckCircle } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [discipline, setDiscipline] = useState('General Academic');
  const [methodologyType, setMethodologyType] = useState('Automatic / Best Fit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paper, setPaper] = useState<ParsedPaper | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(undefined);

  const [examples, setExamples] = useState<FewShotExample[]>([]);
  const [sampleTopics, setSampleTopics] = useState<SampleTopic[]>([]);

  const [isFewShotModalOpen, setIsFewShotModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch examples & sample topics on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const res = await fetch('/api/examples');
        if (res.ok) {
          const data = await res.json();
          if (data.examples) {
            setExamples(data.examples);
            // Pre-load the first exemplar paper so the user can immediately explore the structure
            if (data.examples.length > 0 && !paper) {
              const defaultEx = data.examples[0];
              const parsed = parsePaperMarkdown(defaultEx.content, defaultEx.title, defaultEx.discipline);
              setPaper(parsed);
              setTopic(defaultEx.title);
              setDiscipline(defaultEx.discipline);
            }
          }
          if (data.sampleTopics) {
            setSampleTopics(data.sampleTopics);
          }
        }
      } catch (err) {
        console.warn('Could not load sample examples from server:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handle selecting an example from the dropdown
  const handleSelectExample = (exampleId: string) => {
    const ex = examples.find((e) => e.id === exampleId);
    if (ex) {
      setTopic(ex.title);
      setDiscipline(ex.discipline);
      const parsed = parsePaperMarkdown(ex.content, ex.title, ex.discipline);
      setPaper(parsed);
      setError(null);
    }
  };

  // Generate research paper with streaming SSE
  const handleGenerate = async () => {
    if (!topic.trim() || isGenerating) return;

    setError(null);
    setIsGenerating(true);
    setActiveSectionId('topic-overview');

    // Create abort controller for cancelability
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    let accumulatedMarkdown = '';

    try {
      const response = await fetch('/api/generate-paper/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          discipline,
          methodologyType,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        let errMessage = 'Failed to generate paper';
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch (_) {}
        throw new Error(errMessage);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported in response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ')) {
            const dataStr = cleanLine.substring(6).trim();
            if (dataStr) {
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.chunk) {
                  accumulatedMarkdown += parsed.chunk;
                  const currentParsed = parsePaperMarkdown(accumulatedMarkdown, topic, discipline);
                  setPaper(currentParsed);

                  // Update active section id based on what is being authored
                  if (accumulatedMarkdown.includes('## 9. References')) {
                    setActiveSectionId('references');
                  } else if (accumulatedMarkdown.includes('## 8. Conclusion')) {
                    setActiveSectionId('conclusion');
                  } else if (accumulatedMarkdown.includes('## 7. Research Gaps')) {
                    setActiveSectionId('research-gaps');
                  } else if (accumulatedMarkdown.includes('## 6. Research Methodology')) {
                    setActiveSectionId('research-methodology');
                  } else if (accumulatedMarkdown.includes('## 5. Literature Review')) {
                    setActiveSectionId('literature-review');
                  } else if (accumulatedMarkdown.includes('## 4. Research Questions')) {
                    setActiveSectionId('research-questions');
                  } else if (accumulatedMarkdown.includes('## 3. Research Objectives')) {
                    setActiveSectionId('research-objectives');
                  } else if (accumulatedMarkdown.includes('## 2. Problem Statement')) {
                    setActiveSectionId('problem-statement');
                  } else {
                    setActiveSectionId('topic-overview');
                  }
                }
                if (parsed.done) {
                  break;
                }
              } catch (parseErr) {
                // Ignore JSON parse chunk errors
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Paper generation stopped by user.');
      } else {
        console.error('Generation error:', err);
        setError(err.message || 'Failed to complete paper generation.');
      }
    } finally {
      setIsGenerating(false);
      setActiveSectionId(undefined);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setActiveSectionId(undefined);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        onOpenFewShotModal={() => setIsFewShotModalOpen(true)}
        onSelectExample={handleSelectExample}
        examples={examples}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-3 text-sm no-print animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Generation Notice: </span>
              {error}
              <div className="mt-1 text-xs text-rose-600">
                Ensure an authorized Gemini API key is configured in the environment.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-rose-700 hover:text-rose-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Research Topic Input */}
        <TopicInput
          topic={topic}
          setTopic={setTopic}
          discipline={discipline}
          setDiscipline={setDiscipline}
          methodologyType={methodologyType}
          setMethodologyType={setMethodologyType}
          onGenerate={handleGenerate}
          onCancel={handleCancel}
          isGenerating={isGenerating}
          sampleTopics={sampleTopics}
        />

        {/* 9-Section Progress Architecture Tracker */}
        <SectionTracker
          paper={paper}
          isGenerating={isGenerating}
          activeSectionId={activeSectionId}
        />

        {/* Research Paper Document Viewer */}
        {paper && paper.rawMarkdown ? (
          <PaperViewer
            paper={paper}
            onOpenExport={() => setIsExportModalOpen(true)}
            onPrint={handlePrint}
            isStreaming={isGenerating}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 no-print">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">
              Enter a Research Topic to Begin
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              ScholarForge will prompt Gemini AI using structured few-shot learning to generate a graduate-level academic paper across all 9 scholarly sections with verifiable citations.
            </p>
          </div>
        )}
      </main>

      {/* Few-Shot Prompt Modal */}
      <FewShotModal
        isOpen={isFewShotModalOpen}
        onClose={() => setIsFewShotModalOpen(false)}
        examples={examples}
      />

      {/* Export Manuscript Modal */}
      {paper && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          paper={paper}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}
