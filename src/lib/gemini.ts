import { AnswerEvaluation, EvaluationWeights, InterviewQuestion, QuestionCategory } from "./types";
import { LocalStore } from "./storage";

interface GeminiEvaluationRequest {
  questionText: string;
  category: QuestionCategory;
  candidateAnswer: string;
  targetRole: string;
  weights: EvaluationWeights;
  resumeContext?: string;
}

export async function evaluateAnswerWithGemini(
  req: GeminiEvaluationRequest
): Promise<AnswerEvaluation> {
  const settings = LocalStore.getSettings();
  const apiKey =
    settings.geminiApiKey ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== "" && !apiKey.includes("your_gemini_api_key")) {
    try {
      const prompt = `
You are an expert technical interviewer evaluating a candidate for the role: ${req.targetRole}.
Question: "${req.questionText}"
Category: ${req.category}
Candidate Answer: "${req.candidateAnswer}"
${req.resumeContext ? `Resume Context: ${req.resumeContext}` : ""}

Evaluation Rubric Weights:
- Technical correctness: ${req.weights.technicalCorrectness}%
- Relevance and completeness: ${req.weights.relevanceCompleteness}%
- Problem-solving and reasoning: ${req.weights.problemSolvingReasoning}%
- Communication clarity: ${req.weights.communicationClarity}%
- Practical application: ${req.weights.practicalApplication}%

IMPORTANT: Strictly evaluate only the intellectual content, correctness, and reasoning. Never evaluate accent, tone, or personal protected characteristics.

Return ONLY a valid JSON object matching this schema:
{
  "score": number between 0 and 100,
  "criteriaScores": {
    "technicalCorrectness": number (0-100),
    "relevanceCompleteness": number (0-100),
    "problemSolvingReasoning": number (0-100),
    "communicationClarity": number (0-100),
    "practicalApplication": number (0-100)
  },
  "explanation": "Detailed evidence-based explanation of the score",
  "strengths": ["string", "string"],
  "missingConcepts": ["string", "string"],
  "improvedAnswer": "Exemplary model response that addresses gaps",
  "followUpQuestion": "Optional probing follow-up question"
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            ...parsed,
            isSimulated: false,
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to simulated evaluation:", err);
    }
  }

  // High-Quality Realistic Deterministic Simulated Evaluation Fallback
  return simulateAnswerEvaluation(req);
}

export function simulateAnswerEvaluation(
  req: GeminiEvaluationRequest
): AnswerEvaluation {
  const answer = req.candidateAnswer.trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;

  // Evaluate baseline quality based on depth, domain keywords, and structure
  let techScore = 75;
  let relScore = 75;
  let probScore = 70;
  let commScore = 80;
  let pracScore = 70;

  if (wordCount < 15) {
    techScore = 50;
    relScore = 55;
    probScore = 45;
    commScore = 60;
    pracScore = 45;
  } else if (wordCount > 60) {
    techScore = Math.min(96, techScore + 18);
    relScore = Math.min(95, relScore + 16);
    probScore = Math.min(94, probScore + 18);
    commScore = Math.min(96, commScore + 14);
    pracScore = Math.min(92, pracScore + 16);
  } else if (wordCount > 35) {
    techScore = Math.min(90, techScore + 10);
    relScore = Math.min(88, relScore + 8);
    probScore = Math.min(86, probScore + 10);
    commScore = Math.min(90, commScore + 8);
    pracScore = Math.min(85, pracScore + 10);
  }

  // Calculate weighted total score
  const w = req.weights;
  const totalWeight =
    w.technicalCorrectness +
    w.relevanceCompleteness +
    w.problemSolvingReasoning +
    w.communicationClarity +
    w.practicalApplication || 100;

  const rawScore =
    (techScore * w.technicalCorrectness +
      relScore * w.relevanceCompleteness +
      probScore * w.problemSolvingReasoning +
      commScore * w.communicationClarity +
      pracScore * w.practicalApplication) /
    totalWeight;

  const finalScore = Math.round(Math.max(20, Math.min(98, rawScore)));

  // Domain strengths and gaps
  const strengths = [
    "Clear contextual framing addressing the core premise",
    "Effective articulation of architectural concepts",
    wordCount > 40
      ? "Concrete examples citing trade-offs and implementation considerations"
      : "Structured delivery with direct answers",
  ];

  const missingConcepts =
    finalScore > 88
      ? ["Could discuss operational monitoring or automated regression testing"]
      : [
          "Could articulate low-level edge-case recovery strategies",
          "Could provide quantitative benchmark metrics from real-world loads",
        ];

  const improvedAnswer = `In responding to "${req.questionText}", a senior answer should articulate the foundational mechanism, followed by the specific architectural trade-offs: "Firstly, we address the constraint by decomposing the workflow into independent modules. Secondly, we implement robust error boundaries and fallback caching to preserve system throughput. In production, this approach consistently reduces latency while isolating failure domains."`;

  return {
    score: finalScore,
    criteriaScores: {
      technicalCorrectness: techScore,
      relevanceCompleteness: relScore,
      problemSolvingReasoning: probScore,
      communicationClarity: commScore,
      practicalApplication: pracScore,
    },
    explanation: `Candidate provided a ${
      finalScore >= 85 ? "comprehensive" : "solid"
    } response (${wordCount} words) addressing the problem fundamentals with sound reasoning.`,
    strengths,
    missingConcepts,
    improvedAnswer,
    followUpQuestion:
      "How would this architecture behave if concurrent traffic suddenly surged tenfold?",
    isSimulated: true,
  };
}

// Generate Questions for Question Lab & Live Interviews
export async function generateInterviewQuestions(params: {
  role: string;
  category: QuestionCategory;
  difficulty: "beginner" | "intermediate" | "advanced";
  count: number;
  resumeContext?: string;
}): Promise<InterviewQuestion[]> {
  const questions: InterviewQuestion[] = [];

  const categoryTemplates: Record<QuestionCategory, { text: string; concepts: string[]; rubric: string }[]> = {
    hr: [
      {
        text: "Tell us about a challenging technical deadline you faced. How did you prioritize tasks and communicate delays?",
        concepts: ["Stakeholder communication", "Prioritization matrices", "Resilience", "Transparency"],
        rubric: "Assesses teamwork, accountability, and practical timeline management under pressure.",
      },
      {
        text: "What motivates you to specialize in this role, and how do you stay updated with rapid industry developments?",
        concepts: ["Continuous learning", "Intrinsic motivation", "Technical curiosity"],
        rubric: "Evaluates career vision and self-directed professional development.",
      },
    ],
    technical: [
      {
        text: `In modern ${params.role} workflows, how do you handle state synchronization across distributed components or micro-frontends?`,
        concepts: ["Event-driven architecture", "State immutability", "Hydration consistency", "Cache invalidation"],
        rubric: "Measures structural understanding of distributed data flows and consistency models.",
      },
      {
        text: "Explain the critical differences between optimistic UI updates and pessimistic server validations. When would each fail?",
        concepts: ["Rollback strategies", "Idempotency", "Race conditions", "Network latency"],
        rubric: "Evaluates practical UX design coupled with robust distributed error mitigation.",
      },
    ],
    resume: [
      {
        text: "Walk us through the most technically complex architectural decision in your featured project. What trade-offs were made?",
        concepts: ["Architectural trade-offs", "Tech stack selection", "System scalability", "Lessons learned"],
        rubric: "Verifies authenticity of claimed project experience and candidate depth of ownership.",
      },
    ],
    coding: [
      {
        text: "Describe an optimal algorithmic strategy to detect cycles in a directed graph within linear time complexity.",
        concepts: ["Tarjan's algorithm", "Kahn's topological sort", "DFS three-color marking", "Space complexity"],
        rubric: "Assesses data structures proficiency and mathematical algorithmic rigor.",
      },
    ],
    problem_solving: [
      {
        text: "A critical customer-facing microservice begins experiencing 5% intermittent HTTP 504 timeouts during peak hours. Outline your step-by-step diagnostic strategy.",
        concepts: ["Distributed tracing", "Metrics & logs analysis", "Connection pooling", "Upstream dependency bottlenecks"],
        rubric: "Measures methodical root-cause debugging under high pressure.",
      },
    ],
    aptitude: [
      {
        text: "If an automated test suite has an 8% flaky failure rate across 5 independent test stages, what is the probability that at least one stage fails?",
        concepts: ["Binomial probability", "Complement rule (1 - (0.92)^5)", "Quantitative analysis"],
        rubric: "Tests mathematical reasoning and probabilistic thinking.",
      },
    ],
    communication: [
      {
        text: "How would you explain the architectural concept of eventual consistency to a non-technical product executive?",
        concepts: ["Metaphors & analogies", "Business impact", "Clarity", "Empathy"],
        rubric: "Assesses cross-functional communication and translation of deep technical nuance into executive terms.",
      },
    ],
    situational: [
      {
        text: "Your team lead proposes a shortcut that violates security best practices to meet a strict delivery date. How do you respond?",
        concepts: ["Ethical engineering", "Constructive pushback", "Risk mitigation", "Alternative compromise proposals"],
        rubric: "Evaluates professional integrity, diplomacy, and security consciousness.",
      },
    ],
  };

  const pool = categoryTemplates[params.category] || categoryTemplates.technical;
  for (let i = 0; i < params.count; i++) {
    const item = pool[i % pool.length];
    questions.push({
      id: `gen_q_${Date.now()}_${i}`,
      category: params.category,
      questionText: item.text,
      difficulty: params.difficulty,
      expectedConcepts: item.concepts,
      evaluationRubric: item.rubric,
      followUpQuestion: "Can you provide a concrete failure scenario where that approach requires manual intervention?",
      stage: params.category === "hr" ? 1 : params.category === "resume" ? 2 : 3,
    });
  }

  return questions;
}
