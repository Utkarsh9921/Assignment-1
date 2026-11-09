import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, Loader2, Square, Compass, RefreshCw } from 'lucide-react';
import { SampleTopic } from '../types/paper.ts';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  discipline: string;
  setDiscipline: (discipline: string) => void;
  methodologyType: string;
  setMethodologyType: (methodology: string) => void;
  onGenerate: () => void;
  onCancel: () => void;
  isGenerating: boolean;
  sampleTopics: SampleTopic[];
}

const DISCIPLINES = [
  'General Academic',
  'Artificial Intelligence & Machine Learning',
  'Computer Science & Systems',
  'Medicine, Biology & Healthcare',
  'Quantum Computing & Physics',
  'Environmental Science & Sustainability',
  'Economics & Behavioral Finance',
  'Neuroscience & Cognitive Science',
];

const METHODOLOGIES = [
  'Automatic / Best Fit',
  'Empirical / Experimental Benchmarking',
  'Theoretical & Mathematical Modeling',
  'Systematic Literature Review & Meta-Analysis',
  'Comparative Quantitative Evaluation',
  'Qualitative & Mixed-Methods Framework',
];

export const TopicInput: React.FC<TopicInputProps> = ({
  topic,
  setTopic,
  discipline,
  setDiscipline,
  methodologyType,
  setMethodologyType,
  onGenerate,
  onCancel,
  isGenerating,
  sampleTopics,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isGenerating) {
      onGenerate();
    }
  };

  const handleSelectSample = (sample: SampleTopic) => {
    setTopic(sample.topic);
    if (sample.discipline) setDiscipline(sample.discipline);
    if (sample.methodology) setMethodologyType(sample.methodology);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 transition-all hover:shadow-md no-print">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-800">
              Research Topic or Scientific Question
            </label>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-2 py-1 rounded-md transition-colors ${
                  showFilters ? 'bg-indigo-100 text-indigo-800 font-medium' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />
                Parameters {showFilters ? '▲' : '▼'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-3.5 left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <textarea
              id="topic-input"
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Mitigating Hallucinations in Large Language Models using Retrieval-Augmented Generation"
              className="w-full pl-12 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none font-medium leading-relaxed"
              disabled={isGenerating}
            />
            {topic && !isGenerating && (
              <button
                type="button"
                onClick={() => setTopic('')}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded bg-slate-200/60 hover:bg-slate-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Optional parameter filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-200/60 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Methodological Approach
              </label>
              <select
                value={methodologyType}
                onChange={(e) => setMethodologyType(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
              >
                {METHODOLOGIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Action button & status */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Generates 9 peer-reviewed sections with real, non-fabricated citations</span>
          </div>

          <div className="flex items-center space-x-3">
            {isGenerating ? (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all shadow-sm"
              >
                <Square className="w-4 h-4 mr-2 fill-current" />
                Stop Authoring
              </button>
            ) : (
              <button
                type="submit"
                disabled={!topic.trim()}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
                  topic.trim()
                    ? 'bg-slate-900 hover:bg-indigo-950 text-white shadow-indigo-950/20 hover:shadow-md cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                Generate Research Paper
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggested research topics */}
      {!isGenerating && sampleTopics.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center text-xs font-semibold text-slate-600">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Suggested Research Topics (Click to Populate):
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(item)}
                className="text-left text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors flex items-center gap-1.5 group"
              >
                <span className="font-medium">{item.topic}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 border-l border-slate-200 group-hover:border-indigo-200 pl-1.5">
                  {item.discipline.split('&')[0].trim()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
