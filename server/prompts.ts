/**
 * Prompt engineering and few-shot examples for the Research Paper Agent.
 * Contains two complete example input-output pairs demonstrating rigorous
 * academic structure across all 9 mandatory sections and strict non-fabricated citations.
 */

export const RESEARCH_PAPER_SYSTEM_PROMPT = `You are ScholarForge, an elite academic research assistant and scientific paper authoring agent.
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
- Every reference in Section 9 MUST be a real, verifiable, peer-reviewed academic publication, foundational book, or notable arXiv preprint from legitimate authors and recognized venues (e.g., Nature, Science, IEEE, ACM, NeurIPS, ICML, Lancet, Cell, Springer, Elsevier, etc.).
- Citations in the body of the paper (Literature Review, Methodology, etc.) must precisely match the real entries listed in Section 9 using academic citation format (e.g., [Author et al., Year] or numbered IEEE/APA format).
- Provide complete bibliographic details in Section 9: Authors, Year, Title, Journal/Conference/Source, Volume/Issue/Pages or DOI/arXiv ID where applicable.

ACADEMIC STYLE GUIDELINES:
- Formal, objective, scholarly tone (third-person passive or formal academic active).
- In-depth, analytical treatment rather than superficial summaries.
- Explicitly formulated, numbered Research Objectives (e.g., RO1, RO2, RO3).
- Explicitly formulated, numbered Research Questions (e.g., RQ1, RQ2, RQ3) aligned with the objectives.
- Robust, detailed Research Methodology specifying research paradigm, dataset/sampling characteristics, analytical/experimental framework, baseline comparisons, and evaluation metrics.
- Concrete, actionable identification of Research Gaps that future work can address.
`;

export const FEW_SHOT_EXAMPLE_1 = {
  input: "Mitigating Hallucinations in Large Language Models using Retrieval-Augmented Generation",
  output: `# Mitigating Hallucinations in Large Language Models using Retrieval-Augmented Generation: An Architectural and Evaluative Framework

## 1. Research Topic Overview
Autoregressive Large Language Models (LLMs) have demonstrated exceptional capabilities across complex natural language processing tasks, reasoning benchmarks, and code synthesis. However, their reliance on parametric memory makes them fundamentally prone to "hallucinations"—the generation of factually inaccurate, ungrounded, or fabricated assertions presented with high epistemic confidence. In high-stakes domains such as clinical medicine, jurisprudence, and intelligence analysis, such hallucinations pose catastrophic reliability risks. Retrieval-Augmented Generation (RAG) has emerged as the foremost architectural paradigm to mitigate non-factual outputs by conditioning model generation on external, verifiable knowledge repositories. This research investigates the architectural synthesis of dense vector retrieval, dynamic reranking, and parametric generation to systematically reduce hallucination rates while preserving generative fluency.

## 2. Problem Statement
Despite exponential scaling in parameter size and pre-training tokens, LLMs lack explicit calibration between parametric certainty and real-world truth values. Parametric degradation over time, knowledge cutoffs, and frequency biases in pre-training corpora inevitably induce factual hallucinations. Standard RAG implementations introduce secondary failure modes: retrieval noise, context poisoning from irrelevant passages, and semantic drift during multi-hop synthesis. The core scientific problem is the absence of an integrated, context-calibrated retrieval and verification mechanism capable of dynamically assessing retrieval relevance, filtering epistemic noise, and enforcing strict attribution in downstream generative outputs.

## 3. Research Objectives
- **RO1:** Quantitatively benchmark the hallucination frequency of frontier autoregressive LLMs across standardized factuality datasets before and after RAG integration.
- **RO2:** Formulate an adaptive retrieval-verification architecture incorporating reciprocal rank fusion (RRF) and bidirectional cross-encoder re-ranking.
- **RO3:** Establish an automated, fine-grained citation attribution metric that measures both factual precision and unsupported extrapolation in generated text.
- **RO4:** Evaluate system performance under adversarial and out-of-domain knowledge queries to determine robustness against context distortion.

## 4. Research Questions
- **RQ1:** To what extent does the injection of dynamically retrieved non-parametric contexts reduce intrinsic vs. extrinsic hallucinations in dense LLMs?
- **RQ2:** How does chunking granularity and semantic embedding dimensionality affect the precision of retrieved context in high-density factual queries?
- **RQ3:** What is the quantitative trade-off between generative response latency and factual accuracy when employing secondary cross-encoder re-ranking layers?
- **RQ4:** Can self-reflective attribution mechanisms enable the LLM to autonomously detect and rectify ungrounded assertions prior to final token emission?

## 5. Literature Review
The phenomenon of hallucination in neural natural language generation was comprehensively formalized by Ji et al. (2023), who categorized hallucinations into intrinsic (directly contradicting source materials) and extrinsic (asserting facts ungrounded in any verifiable source). Vaswani et al. (2017) established the foundational Transformer architecture, whose unconstrained attention mechanisms over massive corpora prioritize probabilistic token coherence over factual fidelity.

To ground generative models in verifiable facts, Lewis et al. (2020) pioneered Retrieval-Augmented Generation (RAG), coupling pre-trained sequence-to-sequence models with dense passage retrieval (DPR) over Wikipedia corpora. Borgeaud et al. (2022) extended this with RETRO (Retrieval-Enhanced Transformer), demonstrating that retrieving billions of tokens at 2-trillion-token scales allows smaller models to match the factual accuracy of much larger models.

Recent advancements documented by Gao et al. (2023) categorize RAG evolution into Naive, Advanced, and Modular paradigms. Advanced RAG incorporates pre-retrieval query rewriting, hybrid sparse-dense indexing (BM25 combined with dense semantic vectors), and post-retrieval compression. However, as shown by Min et al. (2023) in their FActScore benchmark, standard retrieval pipelines frequently incorporate extraneous sentences that distract the generator, necessitating rigorous citation verification and attribution modeling.

## 6. Research Methodology
This research adopts a rigorous empirical and comparative experimental methodology:
- **Experimental Corpus & Benchmarks:** Evaluation across three standard factuality benchmarks: TriviaQA, Natural Questions (NQ), and TruthfulQA.
- **Indexing & Retrieval Pipeline:** A hybrid retrieval engine utilizing BM25 (sparse keyword matching) coupled with Dense Passage Retrieval (DPR) utilizing hierarchical navigable small world (HNSW) indexing with cosine similarity.
- **Experimental Conditions:**
  1. Baseline closed-book parametric LLM generation.
  2. Standard single-stage dense RAG.
  3. Advanced Modular RAG with query decomposition, reciprocal rank fusion (RRF), and cross-encoder reranking.
  4. Self-reflective RAG with token-level attribution validation.
- **Quantitative Metrics:**
  - FactScore (Min et al., 2023) to measure atomic factual precision.
  - ROUGE-L and BERTScore for semantic equivalence.
  - Citation Precision and Recall (verifying whether claimed facts match the exact cited passage).
  - End-to-end inference latency (seconds per query).

## 7. Research Gaps
- **Multi-Hop Reasoning Synthesis:** Current RAG pipelines degrade significantly when answering multi-hop queries requiring synthesis across disparate documents that do not share direct lexical overlap.
- **Handling Outdated or Conflicting Sources:** Inability of current retrieval pipelines to reconcile temporal contradictions or conflicting information among retrieved documents.
- **Computational Latency Overhead:** The substantial inference latency introduced by iterative re-ranking and multi-agent verification modules remains prohibitive for real-time edge applications.
- **Hallucination in Retrieval Itself:** Retrieval of semantically similar but factually false web content (corpus pollution) that directly misinforms the generator.

## 8. Conclusion
Retrieval-Augmented Generation represents a paradigm shift in transforming LLMs from fallible parametric memorization engines into grounded, transparent reasoning agents. By coupling parametric weights with structured, external non-parametric verification pipelines, factual hallucinations can be substantially curtailed. However, achieving production-grade reliability requires moving beyond naive dense vector search to modular RAG architectures equipped with semantic reranking, self-reflective attribution checks, and robust conflict resolution protocols. Future research must prioritize low-latency multi-hop reasoning algorithms and automated corpus provenance tracking.

## 9. References
- Borgeaud, S., Mensch, A., Hoffmann, J., Cai, T., Rutherford, E., Millican, K., van den Driessche, G., Lespiau, J.-B., Damoc, B., Clark, A., et al. (2022). Improving language models by retrieving from trillions of tokens. *International Conference on Machine Learning (ICML)*, PMLR, 162: 2206-2240.
- Gao, Y., Xiong, Y., Wang, X., Jiao, L., Zhu, H., Dong, Z., Fan, Z., Chen, W., Wang, Z., & Li, C. (2023). Retrieval-augmented generation for large language models: A survey. *arXiv preprint arXiv:2312.10997*.
- Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Yan, X., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. *ACM Computing Surveys*, 55(12): 1-38. DOI: 10.1145/3571730.
- Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W.-t., Rocktäschel, T., Riedel, S., & Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems (NeurIPS)*, 33: 9459-9474.
- Min, S., Krishna, K., Lyu, X., Lewis, M., Yih, W.-t., Koh, P. W., Iyyer, M., Zettlemoyer, L., & Hajishirzi, H. (2023). FActScore: Fine-grained atomic evaluation of factual precision in long form text generation. *Proceedings of the 2023 Conference on Empirical Methods in Natural Language Processing (EMNLP)*, 12076-12100.
- Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. *Advances in Neural Information Processing Systems (NeurIPS)*, 30: 5998-6008.`
};

export const FEW_SHOT_EXAMPLE_2 = {
  input: "Decentralized Federated Learning for Privacy-Preserving Medical Imaging Diagnosis",
  output: `# Decentralized Federated Learning for Privacy-Preserving Medical Imaging Diagnosis: Architectures, Robustness, and Clinical Translation

## 1. Research Topic Overview
Deep learning has achieved dermatologist-level and radiologist-level diagnostic accuracy in medical image analysis, spanning computerized tomography (CT), magnetic resonance imaging (MRI), and histopathology. Nevertheless, training robust clinical models requires heterogeneous, multi-institutional datasets to mitigate institutional demographic bias and scanner-specific domain shifts. Centralizing patient imaging records within single cloud silos violates stringent healthcare privacy regulations, including HIPAA (Health Insurance Portability and Accountability Act) and GDPR (General Data Protection Regulation). Federated Learning (FL) offers a transformative collaborative paradigm: clinical sites locally compute gradient updates on patient data, transmitting only aggregated parameter weights to a central server without exposing raw protected health information (PHI). This paper investigates decentralized federated architectures to ensure privacy, model generalization, and Byzantine fault tolerance in multi-site clinical diagnostics.

## 2. Problem Statement
While centralized machine learning delivers high performance, healthcare institutions face legal, ethical, and competitive barriers preventing cross-institutional data aggregation. Conventional Federated Averaging (FedAvg) partially resolves data locality but suffers from acute vulnerabilities in medical imaging deployments: (1) client data is non-IID (non-identically and independently distributed) due to disparate clinical demographics, varying image acquisition protocols, and disease prevalence skews; (2) central aggregator servers remain single points of failure vulnerable to gradient inversion attacks, wherein deep neural network weights can be reverse-engineered to reconstruct original anatomical patient scans; and (3) communication bottlenecks occur when transferring multi-gigabyte convolutional or vision transformer weight updates across bandwidth-constrained hospital networks.

## 3. Research Objectives
- **RO1:** Design a decentralized peer-to-peer federated learning framework that eliminates centralized server reliance via cryptographic consensus and differential privacy.
- **RO2:** Formulate a personalized federated aggregation algorithm that handles severe non-IID visual distribution skews across distinct hospital scanner modalities.
- **RO3:** Implement and benchmark formal differential privacy guarantees (ε, δ) against state-of-the-art gradient leakage and membership inference attacks.
- **RO4:** Quantify communication efficiency and convergence latency using sparse quantized gradient representations tailored for hospital intranet infrastructure.

## 4. Research Questions
- **RQ1:** How does the degree of institutional data heterogeneity (measured by Dirichlet distribution α) impact the convergence stability and diagnostic specificity of global medical imaging classifiers?
- **RQ2:** To what extent can Rényi Differential Privacy be applied to local hospital gradients without degrading the Area Under the Receiver Operating Characteristic (AUROC) below clinically acceptable diagnostic thresholds?
- **RQ3:** Does a decentralized gossip-based weight exchange protocol outperform traditional client-server FedAvg in fault-tolerance when clinical sites experience unscheduled network dropouts?
- **RQ4:** Can self-supervised pre-training on unlabeled local hospital scans bridge cross-institutional domain gaps prior to federated fine-tuning?

## 5. Literature Review
Federated Learning was fundamentally formulated by McMahan et al. (2017), introducing Federated Averaging (FedAvg) to demonstrate that iterative local gradient descent with periodic global aggregation produces convergence on distributed non-convex objectives. The potential and specific challenges of federated architectures in healthcare were synthesized by Rieke et al. (2020), emphasizing that institutional privacy laws necessitate collaborative learning without raw data movement.

In medical imaging, Sheller et al. (2020) demonstrated the clinical viability of FL on multi-institutional brain tumor segmentation (BraTS benchmark), showing that federated models achieve over 99% of the dice coefficient performance of centralized training. However, Li et al. (2020) demonstrated that non-IID clinical data causes client drift, proposing FedProx to introduce a proximal regularization term that stabilizes optimization across heterogeneous nodes.

Crucially, the assumption that transmitting model weights guarantees complete privacy was disproven by Zhu, Liu, and Han (2019), who demonstrated that Deep Leakage from Gradients (DLG) can reconstruct pixel-level training images. To mitigate this, Kaissis et al. (2020) advocated for the rigorous union of federated learning, homomorphic encryption, and secure multiparty computation to guarantee mathematical privacy bounds for confidential clinical computing.

## 6. Research Methodology
The proposed study implements a comprehensive simulated multi-institutional federated testbed:
- **Clinical Datasets:** CheXpert (224,316 chest radiographs from Stanford Hospital), NIH ChestX-ray14 (112,120 frontal views), and PadChest (160,000 images from Hospital San Juan).
- **Federated Topology:** A simulated 10-node consortium representing distinct hospital tiers, partitioned with a Dirichlet distribution (α = 0.1 to 1.0) to model acute pathological prevalence imbalances.
- **Model Architecture:** Vision Transformer (ViT-B/16) and DenseNet-121 backbones initialized via self-supervised contrastive learning (SimCLR).
- **Federated Training Protocols:**
  - Benchmark FedAvg baseline vs. FedProx vs. SCAFFOLD vs. our proposed Decentralized Robust Federated Optimizer (DR-Fed).
  - Integration of Gaussian Differential Privacy mechanism calibrated with Rényi DP accountant.
- **Evaluation Metrics:** Multi-label AUROC, F1-Score, Dice Coefficient, Communication Volume (GB exchanged per round), and reconstruction vulnerability against analytic gradient inversion attacks.

## 7. Research Gaps
- **Real-World Client Dropout & Asynchrony:** Existing studies assume synchronous communication rounds, whereas real hospital compute clusters encounter irregular operational downtimes and maintenance windows.
- **Standardization of Secure Enclaves:** Lack of standardized integration between federated algorithms and clinical hardware security modules (e.g., Intel SGX, AMD SEV) in hospital data centers.
- **Fairness and Subgroup Disparities:** Federated models may inadvertently maximize global accuracy while sacrificing diagnostic sensitivity for marginalized patient demographic cohorts represented in smaller rural hospital nodes.
- **Regulatory Certification Frameworks:** Absence of standardized FDA/EMA validation pipelines for continuously updating federated models whose parameters evolve post-deployment.

## 8. Conclusion
Federated learning provides a vital paradigm for unlocking collaborative machine intelligence across fragmented healthcare ecosystems while preserving patient privacy. By addressing non-IID clinical data distributions through proximal regularization, protecting weight updates with differential privacy, and decentralizing the consensus mechanism, multi-center diagnostic models can approach the performance of centralized architectures. Transitioning federated learning from simulated academic benchmarks to clinical bedside practice requires closing remaining gaps in asynchronous communication, algorithmic subgroup fairness, and rigorous regulatory auditability.

## 9. References
- Kaissis, G. A., Makowski, M. R., Rückert, D., & Braren, R. F. (2020). Secure, privacy-preserving and federated machine learning in medical imaging. *Nature Machine Intelligence*, 2(6): 305-311. DOI: 10.1038/s42256-020-0186-1.
- Li, T., Sahu, A. K., Zaheer, M., Sanjabi, M., Talwalkar, A., & Smith, V. (2020). Federated optimization in heterogeneous networks. *Proceedings of Machine Learning and Systems (MLSys)*, 2: 429-450.
- McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A. (2017). Communication-efficient learning of deep networks from decentralized data. *Artificial Intelligence and Statistics (AISTATS)*, PMLR, 54: 1273-1282.
- Rieke, N., Hancox, J., Li, W., Milletarì, F., Roth, H. R., Albarqouni, S., Bakas, S., Galtier, M. N., Landman, B. A., Maier-Hein, K., et al. (2020). The future of digital health with federated learning. *Nature Digital Medicine*, 3(1): 119. DOI: 10.1038/s41746-020-00323-1.
- Sheller, M. J., Edwards, B., Reina, G. A., Martin, J., Pati, S., Kotrotsou, A., Milchenko, M., Xu, W., Marcus, D., Colen, R. R., & Bakas, S. (2020). Federated learning in medicine: facilitating multi-institutional collaborations without sharing patient data. *Scientific Reports*, 10(1): 12598. DOI: 10.1038/s41598-020-69250-1.
- Zhu, L., Liu, Z., & Han, S. (2019). Deep leakage from gradients. *Advances in Neural Information Processing Systems (NeurIPS)*, 32: 14774-14784.`
};

export function buildFewShotPrompt(userTopic: string, options?: { discipline?: string; methodologyType?: string; targetLength?: string }): string {
  const disciplineNote = options?.discipline && options.discipline !== 'General Academic' ? `Target Academic Discipline: ${options.discipline}\n` : '';
  const methodologyNote = options?.methodologyType && options.methodologyType !== 'Automatic / Best Fit' ? `Preferred Methodology Style: ${options.methodologyType}\n` : '';

  return `Follow the exact academic structure, graduate-level tone, and scholarly rigor shown in the two few-shot examples below.
Generate the complete research paper including all 9 numbered sections.
DO NOT fabricate references; cite legitimate, established papers and foundational works in the field.

--- BEGIN FEW-SHOT EXAMPLE 1 ---
[INPUT TOPIC]: ${FEW_SHOT_EXAMPLE_1.input}
[GENERATED RESEARCH PAPER]:
${FEW_SHOT_EXAMPLE_1.output}
--- END FEW-SHOT EXAMPLE 1 ---

--- BEGIN FEW-SHOT EXAMPLE 2 ---
[INPUT TOPIC]: ${FEW_SHOT_EXAMPLE_2.input}
[GENERATED RESEARCH PAPER]:
${FEW_SHOT_EXAMPLE_2.output}
--- END FEW-SHOT EXAMPLE 2 ---

--- NOW GENERATE THE RESEARCH PAPER FOR THE FOLLOWING USER TOPIC ---
${disciplineNote}${methodologyNote}[INPUT TOPIC]: ${userTopic.trim()}
[GENERATED RESEARCH PAPER]:
`;
}
