import { MANDATORY_SECTIONS, ParsedPaper, PaperReference, PaperSection } from '../types/paper.ts';

/**
 * Splits and parses markdown into structured research paper sections.
 */
export function parsePaperMarkdown(markdown: string, topic: string, discipline?: string): ParsedPaper {
  if (!markdown) {
    return {
      title: topic || 'Untitled Research Paper',
      rawMarkdown: '',
      sections: [],
      references: [],
      wordCount: 0,
      readingTimeMinutes: 0,
      generatedAt: new Date().toISOString(),
      topic,
      discipline,
    };
  }

  // Extract main title (first level 1 heading)
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic;

  const sections: PaperSection[] = [];

  // Match canonical section patterns like: "## 1. Research Topic Overview" or "## 1: Research Topic Overview" or "## Section 1: ..."
  MANDATORY_SECTIONS.forEach((meta) => {
    // Regex looks for ## followed by section number and title, capturing everything up to next ## or end of string
    const escapedTitle = meta.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const sectionRegex = new RegExp(
      `##\\s*(?:${meta.number}[.:]|Section\\s*${meta.number}[.:]?)\\s*${escapedTitle}[^\\n]*\\n([\\s\\S]*?)(?=(?:\\n##\\s*\\d|\\n##\\s*Section|\\Z))`,
      'i'
    );

    const match = markdown.match(sectionRegex);
    let content = '';

    if (match && match[1]) {
      content = match[1].trim();
    } else {
      // Fallback: look for just number or title
      const looseRegex = new RegExp(
        `##\\s*${meta.number}[.:\\s]+([^\\n]+)\\n([\\s\\S]*?)(?=(?:\\n##\\s*\\d|\\n##\\s*Section|\\Z))`,
        'i'
      );
      const looseMatch = markdown.match(looseRegex);
      if (looseMatch && looseMatch[2]) {
        content = looseMatch[2].trim();
      }
    }

    const words = content.split(/\s+/).filter(Boolean).length;

    sections.push({
      number: meta.number,
      id: meta.id,
      title: meta.title,
      content,
      wordCount: words,
    });
  });

  // Extract references from section 9
  const referencesSection = sections.find((s) => s.number === 9);
  const references: PaperReference[] = [];

  if (referencesSection && referencesSection.content) {
    const lines = referencesSection.content.split('\n');
    let refIndex = 1;

    lines.forEach((line) => {
      const cleanLine = line.replace(/^[-*•\d.)\]\s]+/, '').trim();
      if (cleanLine.length > 15) {
        // Attempt parsing Author, Year, Title, Venue
        // Example: "Lewis, P. et al. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. Advances in Neural Information Processing Systems..."
        const yearMatch = cleanLine.match(/\((\d{4}[a-z]?)\)/);
        const year = yearMatch ? yearMatch[1] : '';
        const authorPart = yearMatch ? cleanLine.substring(0, yearMatch.index).trim().replace(/[.,;]$/, '') : '';
        
        let titlePart = '';
        let venuePart = cleanLine;

        if (yearMatch && yearMatch.index !== undefined) {
          const afterYear = cleanLine.substring(yearMatch.index + yearMatch[0].length).trim().replace(/^[.:]\s*/, '');
          const titleEnd = afterYear.search(/[.?!](?:\s+[*_A-Z]|\s*$)/);
          if (titleEnd !== -1) {
            titlePart = afterYear.substring(0, titleEnd).trim().replace(/^[*_]+|[*_]+$/g, '');
            venuePart = afterYear.substring(titleEnd + 1).trim();
          } else {
            titlePart = afterYear;
          }
        }

        const doiMatch = cleanLine.match(/(?:doi\.org\/|DOI:\s*)([^\s]+)/i);

        references.push({
          id: `ref-${refIndex++}`,
          rawText: cleanLine,
          authorYear: authorPart && year ? `${authorPart} (${year})` : authorPart || `Reference ${refIndex - 1}`,
          title: titlePart || cleanLine.substring(0, 80) + '...',
          venue: venuePart || 'Academic Publication',
          doiOrUrl: doiMatch ? (doiMatch[1].startsWith('http') ? doiMatch[1] : `https://doi.org/${doiMatch[1]}`) : undefined,
        });
      }
    });
  }

  const totalWords = markdown.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(totalWords / 220));

  return {
    title,
    rawMarkdown: markdown,
    sections,
    references,
    wordCount: totalWords,
    readingTimeMinutes: readingTime,
    generatedAt: new Date().toISOString(),
    topic,
    discipline,
  };
}

/**
 * Converts parsed references into BibTeX bibliography format.
 */
export function generateBibTeX(paper: ParsedPaper): string {
  if (!paper.references.length) return '% No references parsed.';

  return paper.references
    .map((ref, idx) => {
      const citeKey = `cite_${idx + 1}_${(ref.authorYear || 'ref').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const title = ref.title.replace(/[{}]/g, '');
      const venue = ref.venue.replace(/[*_]/g, '');

      return `@article{${citeKey},
  author = {${ref.authorYear.replace(/\s*\(\d{4}\)/, '') || 'Authors'}},
  title = {{${title}}},
  journal = {${venue || 'Academic Journal / Conference'}},
  year = {${ref.rawText.match(/\b(19\d\d|20\d\d)\b/)?.[1] || '2024'}},
  note = {Verified Academic Literature}
}`;
    })
    .join('\n\n');
}

/**
 * Exports the complete research paper to LaTeX format.
 */
export function generateLaTeX(paper: ParsedPaper): string {
  const sectionsLatex = paper.sections
    .map((s) => {
      // Escape latex special characters in content
      const cleanContent = s.content
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}')
        .replace(/\*(.+?)\*/g, '\\textit{$1}');

      return `\\section{${s.title}}\n${cleanContent}\n`;
    })
    .join('\n');

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{amsmath,amsfonts,amssymb}
\\usepackage{hyperref}
\\usepackage{booktabs}
\\usepackage{cite}

\\title{\\textbf{${paper.title.replace(/&/g, '\\&')}}}
\\author{ScholarForge Research Agent \\\\ \\small Powered by Gemini AI}
\\date{\\today}

\\begin{document}
\\maketitle

\\begin{abstract}
This research manuscript investigates ${paper.topic.replace(/&/g, '\\&')}, formulating explicit research objectives, analytical questions, and methodological frameworks grounded in verifiable scholarly literature.
\\end{abstract}

${sectionsLatex}

\\end{document}
`;
}
