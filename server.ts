import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { RESEARCH_PAPER_SYSTEM_PROMPT, buildFewShotPrompt, FEW_SHOT_EXAMPLE_1, FEW_SHOT_EXAMPLE_2 } from './server/prompts.ts';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialise Google GenAI client with required aistudio-build telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// GET /api/health - Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    model: 'gemini-3.8-flash',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// GET /api/examples - Retrieve sample research papers & few-shot examples
app.get('/api/examples', (req, res) => {
  res.json({
    examples: [
      {
        id: 'rag-hallucinations',
        title: FEW_SHOT_EXAMPLE_1.input,
        discipline: 'Artificial Intelligence & NLP',
        preview: 'Mitigating Hallucinations in Large Language Models using Retrieval-Augmented Generation...',
        content: FEW_SHOT_EXAMPLE_1.output,
      },
      {
        id: 'federated-medical',
        title: FEW_SHOT_EXAMPLE_2.input,
        discipline: 'Healthcare & Machine Learning',
        preview: 'Decentralized Federated Learning for Privacy-Preserving Medical Imaging Diagnosis...',
        content: FEW_SHOT_EXAMPLE_2.output,
      },
    ],
    sampleTopics: [
      {
        topic: 'Quantum Error Correction in Fault-Tolerant Superconducting Qubits',
        discipline: 'Quantum Computing & Physics',
        methodology: 'Experimental & Simulation',
      },
      {
        topic: 'Zero-Knowledge Proofs for Scalable and Private Layer-2 Blockchain Protocols',
        discipline: 'Cryptography & Distributed Systems',
        methodology: 'Formal Verification & Benchmarking',
      },
      {
        topic: 'CRISPR-Cas9 Off-Target Cleavage Prediction Using Deep Graph Neural Networks',
        discipline: 'Computational Biology & Genomics',
        methodology: 'Empirical Bioinformatic Modeling',
      },
      {
        topic: 'Urban Heat Island Mitigation Through High-Albedo Surfaces and Green Corridors',
        discipline: 'Environmental Engineering & Urban Planning',
        methodology: 'Longitudinal Spatiotemporal Analysis',
      },
      {
        topic: 'Algorithmic Pricing in Collusive Oligopolies: Antitrust and Game-Theoretic Frameworks',
        discipline: 'Economics & Behavioral Game Theory',
        methodology: 'Mathematical Modeling & Econometrics',
      },
    ],
  });
});

// POST /api/generate-paper/stream - Server-Sent Events (SSE) streaming paper generation
app.post('/api/generate-paper/stream', async (req, res) => {
  const { topic, discipline, methodologyType } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Please provide a valid research topic.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please verify your API key in Settings > Secrets.',
    });
    return;
  }

  // Set SSE response headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  const prompt = buildFewShotPrompt(topic, { discipline, methodologyType });

  try {
    const stream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RESEARCH_PAPER_SYSTEM_PROMPT,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('Error generating paper stream:', error);
    const errorMessage = error?.message || 'An error occurred during paper generation.';
    res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
    res.end();
  }
});

// POST /api/generate-paper - Synchronous generation endpoint
app.post('/api/generate-paper', async (req, res) => {
  const { topic, discipline, methodologyType } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    res.status(400).json({ error: 'Please provide a valid research topic.' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please verify your API key in Settings > Secrets.',
    });
    return;
  }

  const prompt = buildFewShotPrompt(topic, { discipline, methodologyType });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: RESEARCH_PAPER_SYSTEM_PROMPT,
      },
    });

    const markdownText = response.text || '';
    res.json({
      success: true,
      paperMarkdown: markdownText,
      topic,
    });
  } catch (error: any) {
    console.error('Error in synchronous generation:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate research paper.',
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Research Paper Agent server running on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
