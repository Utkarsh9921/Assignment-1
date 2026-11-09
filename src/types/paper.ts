export interface PaperSection {
  number: number;
  id: string;
  title: string;
  content: string;
  wordCount: number;
}

export interface PaperReference {
  id: string;
  rawText: string;
  authorYear: string;
  title: string;
  venue: string;
  doiOrUrl?: string;
}

export interface ParsedPaper {
  title: string;
  rawMarkdown: string;
  sections: PaperSection[];
  references: PaperReference[];
  wordCount: number;
  readingTimeMinutes: number;
  generatedAt: string;
  topic: string;
  discipline?: string;
}

export interface SampleTopic {
  topic: string;
  discipline: string;
  methodology: string;
}

export interface FewShotExample {
  id: string;
  title: string;
  discipline: string;
  preview: string;
  content: string;
}

export const MANDATORY_SECTIONS = [
  { number: 1, id: 'topic-overview', title: 'Research Topic Overview', shortTitle: 'Overview' },
  { number: 2, id: 'problem-statement', title: 'Problem Statement', shortTitle: 'Problem' },
  { number: 3, id: 'research-objectives', title: 'Research Objectives', shortTitle: 'Objectives' },
  { number: 4, id: 'research-questions', title: 'Research Questions', shortTitle: 'Questions' },
  { number: 5, id: 'literature-review', title: 'Literature Review', shortTitle: 'Lit Review' },
  { number: 6, id: 'research-methodology', title: 'Research Methodology', shortTitle: 'Methodology' },
  { number: 7, id: 'research-gaps', title: 'Research Gaps', shortTitle: 'Gaps' },
  { number: 8, id: 'conclusion', title: 'Conclusion', shortTitle: 'Conclusion' },
  { number: 9, id: 'references', title: 'References', shortTitle: 'References' },
];
