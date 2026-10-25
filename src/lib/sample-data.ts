import {
  Campaign,
  ResumeDocument,
  InterviewSession,
  RepeatTestItem,
  CodingProblem,
  InterviewQuestion,
} from "./types";

export const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: "camp_frontend_2026",
    title: "Frontend Engineering Campus Drive 2026",
    role: "Frontend Developer",
    organization: "Nexora Technologies",
    department: "User Experience & Web Platforms",
    description:
      "Seeking energetic frontend developers proficient in modern React, Next.js, TypeScript, and state management. You will build high-performance, accessible, and responsive customer-facing web applications with rich micro-animations.",
    requiredSkills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "State Management",
      "Web Performance",
      "HTML5/CSS3",
      "Git",
    ],
    startDate: "2026-10-01T09:00:00Z",
    deadline: "2026-11-30T23:59:59Z",
    durationMinutes: 25,
    questionCount: 5,
    categories: ["hr", "resume", "technical", "coding", "problem_solving"],
    evaluationWeights: {
      technicalCorrectness: 35,
      relevanceCompleteness: 25,
      problemSolvingReasoning: 20,
      communicationClarity: 10,
      practicalApplication: 10,
    },
    status: "active",
    createdAt: "2026-10-01T08:00:00Z",
  },
  {
    id: "camp_aiml_2026",
    title: "Applied AI & GenAI Research Associate",
    role: "AI/ML Engineer",
    organization: "CognitiveMatrix Labs",
    department: "Artificial Intelligence & R&D",
    description:
      "Join our pioneering generative AI team. Candidates will design retrieval-augmented generation (RAG) pipelines, fine-tune open-weights LLMs, implement vector databases, and deploy robust AI agent workflows.",
    requiredSkills: [
      "Python",
      "PyTorch",
      "LangChain",
      "Vector Databases (Pinecone/Chroma)",
      "Transformers",
      "RAG Architecture",
      "Model Evaluation",
      "FastAPI",
    ],
    startDate: "2026-10-10T10:00:00Z",
    deadline: "2026-12-15T23:59:59Z",
    durationMinutes: 30,
    questionCount: 5,
    categories: ["hr", "resume", "technical", "problem_solving", "situational"],
    evaluationWeights: {
      technicalCorrectness: 40,
      relevanceCompleteness: 20,
      problemSolvingReasoning: 25,
      communicationClarity: 10,
      practicalApplication: 5,
    },
    status: "active",
    createdAt: "2026-10-10T09:30:00Z",
  },
  {
    id: "camp_fullstack_2026",
    title: "Full-Stack Cloud Software Engineer",
    role: "Full-Stack Developer",
    organization: "Vanguard Cloud Systems",
    department: "Enterprise Cloud Solutions",
    description:
      "We are looking for full-stack software engineers capable of designing resilient microservices, high-throughput REST/GraphQL APIs, relational database schemas, and intuitive browser frontends.",
    requiredSkills: [
      "Node.js",
      "TypeScript",
      "React",
      "PostgreSQL",
      "Docker",
      "REST APIs",
      "GraphQL",
      "Redis",
      "AWS Basics",
    ],
    startDate: "2026-09-15T08:00:00Z",
    deadline: "2026-12-01T23:59:59Z",
    durationMinutes: 30,
    questionCount: 6,
    categories: ["hr", "resume", "technical", "coding", "situational"],
    evaluationWeights: {
      technicalCorrectness: 35,
      relevanceCompleteness: 25,
      problemSolvingReasoning: 20,
      communicationClarity: 10,
      practicalApplication: 10,
    },
    status: "active",
    createdAt: "2026-09-15T07:45:00Z",
  },
];

export const SAMPLE_RESUMES: ResumeDocument[] = [
  {
    id: "res_alex_rivera",
    candidateId: "cand_alex_001",
    fileName: "Alex_Rivera_Frontend_Resume.pdf",
    fileType: "pdf",
    uploadDate: "2026-10-20T14:30:00Z",
    extractedText: `ALEX RIVERA
Email: alex.rivera@example.edu | Phone: +1 (555) 349-2841 | Location: Austin, TX
LinkedIn: linkedin.com/in/alex-rivera-dev | GitHub: github.com/alexrivera

OBJECTIVE
Motivated Computer Science graduate with hands-on experience building scalable web applications using React, TypeScript, Next.js, and modern UI engineering principles. Passionate about design systems and web performance.

EDUCATION
B.S. in Computer Science & Engineering | University of Technology (2022 - 2026)
GPA: 3.82 / 4.0 | Dean's Honor Roll (All Semesters)
Relevant Coursework: Data Structures & Algorithms, Web Architecture, Distributed Systems, Database Management.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), HTML5, CSS3, Python, SQL
Frameworks & Libraries: React 18/19, Next.js (App Router), Tailwind CSS, Framer Motion, Redux Toolkit, React Query
Tools & Platforms: Git/GitHub, Docker, Vite, Vercel, Figma, Jest, Playwright

PROJECTS
1. OmniFlow Kanban & Collaboration Suite
- Developed a high-performance Kanban dashboard in Next.js 15 with optimistic UI updates and real-time collaboration.
- Reduced initial bundle size by 38% using route prefetching and code splitting.
- Implemented drag-and-drop interactions with 60fps smooth animations using Framer Motion.

2. DevPulse - Developer Metrics Visualizer
- Built an interactive analytics tool connecting to GitHub GraphQL APIs to visualize code frequency and PR review cycles.
- Integrated Recharts with custom tooltips and responsive SVG containers.

EXPERIENCE
Frontend Developer Intern | PixelCraft Studios (Summer 2025)
- Collaborated with 4 senior engineers to refactor legacy jQuery pages to React + Tailwind components.
- Authored 24 reusable component tokens adopted across 3 customer portals.
- Improved Core Web Vitals (LCP improved from 3.2s to 1.1s).

CERTIFICATIONS
- Meta Frontend Developer Professional Certificate (2024)
- AWS Certified Cloud Practitioner (2025)`,
    parsedData: {
      fullName: "Alex Rivera",
      email: "alex.rivera@example.edu",
      phone: "+1 (555) 349-2841",
      education: [
        "B.S. in Computer Science & Engineering - University of Technology (2022 - 2026, GPA: 3.82/4.0)",
      ],
      skills: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Framer Motion",
        "Redux Toolkit",
        "HTML5/CSS3",
        "Git",
        "Docker",
        "Vite",
        "Web Performance",
      ],
      projects: [
        {
          title: "OmniFlow Kanban & Collaboration Suite",
          description:
            "High-performance Kanban dashboard in Next.js 15 with optimistic UI updates and Framer Motion animations.",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
        },
        {
          title: "DevPulse - Developer Metrics Visualizer",
          description:
            "Interactive analytics tool connected to GitHub GraphQL API with Recharts charts.",
          techStack: ["React", "GraphQL", "Recharts", "TypeScript"],
        },
      ],
      experience: [
        {
          role: "Frontend Developer Intern",
          company: "PixelCraft Studios",
          duration: "May 2025 - August 2025",
          details:
            "Refactored legacy code to React + Tailwind, improved LCP from 3.2s to 1.1s, authored 24 reusable tokens.",
        },
      ],
      certifications: [
        "Meta Frontend Developer Professional Certificate",
        "AWS Certified Cloud Practitioner",
      ],
    },
    verificationScore: 94,
    verificationNotes: [
      "Contact information matches declared student profile.",
      "Identified 12 verified technical skills matching Frontend Drive requirements.",
      "Demonstrated production internship experience with measurable performance gains (LCP 3.2s -> 1.1s).",
      "Active degree verified with expected graduation 2026.",
    ],
    matchScore: 92,
    missingSkills: ["State Management (Zustand/XState)", "CI/CD Pipelines"],
  },
  {
    id: "res_priya_sharma",
    candidateId: "cand_priya_002",
    fileName: "Priya_Sharma_AIML_Resume.pdf",
    fileType: "pdf",
    uploadDate: "2026-10-22T11:15:00Z",
    extractedText: `PRIYA SHARMA
Email: priya.sharma@aiml.ac.in | Phone: +91 98451 22890 | Bangalore, India
LinkedIn: linkedin.com/in/priya-sharma-ai | GitHub: github.com/priyasharma-ml

OBJECTIVE
Aspiring AI/ML Engineer with strong mathematical foundations, expertise in deep learning, LLM fine-tuning, retrieval-augmented generation (RAG), and PyTorch model deployment.

EDUCATION
B.Tech in Artificial Intelligence & Data Science | Indian Institute of Information Technology (2022 - 2026)
CGPA: 9.15 / 10.0 | Academic Excellence Award
Key Courses: Deep Learning, Natural Language Processing, Linear Algebra, Probability & Statistics, Reinforcement Learning.

TECHNICAL SKILLS
Languages: Python, C++, SQL, Bash
ML & Deep Learning: PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, Scikit-Learn
Vector DBs & Cloud: ChromaDB, Pinecone, FAISS, Docker, FastAPI, AWS EC2/S3
Evaluation: Ragas, BLEU, ROUGE, Weights & Biases

PROJECTS
1. MediAssist RAG - Biomedical Q&A System
- Built an enterprise RAG system querying 10,000+ PubMed clinical trials using ChromaDB and Mistral-7B-Instruct.
- Formulated recursive semantic chunking and reciprocal rank fusion reranking, boosting retrieval precision by 24%.
- Deployed asynchronous inference pipeline with FastAPI and Docker.

2. CodeClarify - Multi-Agent Code Reviewer
- Designed a LangGraph-powered multi-agent framework where specialized LLM agents perform AST analysis, security vulnerability scanning, and documentation generation.

EXPERIENCE
Machine Learning Research Intern | Synapse AI Labs (June 2025 - August 2025)
- Evaluated LoRA vs QLoRA quantization trade-offs on domain-specific 8B parameter models.
- Authored experimental pipeline using Weights & Biases tracking 40+ hyperparameters.

CERTIFICATIONS
- DeepLearning.AI Deep Learning Specialization (Andrew Ng)
- Hugging Face Transformers NLP Certification`,
    parsedData: {
      fullName: "Priya Sharma",
      email: "priya.sharma@aiml.ac.in",
      phone: "+91 98451 22890",
      education: [
        "B.Tech in Artificial Intelligence & Data Science - IIIT (2022 - 2026, CGPA: 9.15/10)",
      ],
      skills: [
        "Python",
        "PyTorch",
        "Hugging Face",
        "LangChain",
        "LlamaIndex",
        "ChromaDB",
        "Pinecone",
        "RAG Architecture",
        "FastAPI",
        "Transformers",
        "Docker",
      ],
      projects: [
        {
          title: "MediAssist RAG - Biomedical Q&A System",
          description:
            "Enterprise RAG system querying PubMed trials using ChromaDB, Mistral-7B, and reciprocal rank fusion.",
          techStack: ["Python", "ChromaDB", "Mistral-7B", "FastAPI"],
        },
        {
          title: "CodeClarify - Multi-Agent Code Reviewer",
          description:
            "LangGraph-powered multi-agent pipeline for code security and AST evaluation.",
          techStack: ["LangGraph", "Python", "Docker"],
        },
      ],
      experience: [
        {
          role: "Machine Learning Research Intern",
          company: "Synapse AI Labs",
          duration: "June 2025 - August 2025",
          details:
            "LoRA vs QLoRA quantization trade-offs, Weights & Biases automated tracking on 8B parameter models.",
        },
      ],
      certifications: [
        "DeepLearning.AI Deep Learning Specialization",
        "Hugging Face Transformers NLP Certification",
      ],
    },
    verificationScore: 96,
    verificationNotes: [
      "Candidate credentials aligned with AI/ML Associate drive.",
      "Strong publication and project alignment in RAG and vector database architectures.",
      "Verified research internship at Synapse AI Labs.",
      "Consistent academic record (CGPA 9.15).",
    ],
    matchScore: 95,
    missingSkills: ["Kubernetes", "Triton Inference Server"],
  },
];

export const SAMPLE_SUBMISSIONS: InterviewSession[] = [
  {
    id: "sess_demo_001",
    candidateId: "cand_priya_002",
    candidateName: "Priya Sharma",
    candidateEmail: "priya.sharma@aiml.ac.in",
    rollNumber: "22AI042",
    campaignId: "camp_aiml_2026",
    campaignTitle: "Applied AI & GenAI Research Associate",
    targetRole: "AI/ML Engineer",
    language: "en",
    difficulty: "advanced",
    startTime: "2026-10-24T10:00:00Z",
    endTime: "2026-10-24T10:28:45Z",
    status: "completed",
    overallScore: 89,
    resumeMatchScore: 95,
    isDemo: true,
    hiringDecision: "shortlisted",
    recruiterNotes:
      "Exceptional grasp of vector retrieval nuances and chunking strategies. Clearly articulated reciprocal rank fusion and quantization trade-offs. Strongly recommended for technical round 2.",
    integrityEvents: [
      {
        id: "int_01",
        timestamp: "2026-10-24T10:12:30Z",
        eventType: "tab_blur",
        description: "Browser window temporarily lost focus for 3 seconds",
        severity: "info",
      },
    ],
    responses: [
      {
        questionId: "q_aiml_1",
        questionText:
          "Can you briefly introduce yourself and describe your motivation for focusing on Generative AI and RAG architectures?",
        category: "hr",
        stage: 1,
        candidateAnswer:
          "Hello! I am Priya Sharma, a final-year AI student at IIIT. Over the last two years, I have gravitated heavily toward generative AI, specifically retrieval-augmented generation. What excites me most is bridging the hallucination gap of large language models with grounded deterministic enterprise knowledge. During my internship at Synapse AI, I evaluated quantization trade-offs on 8B parameter models, and built MediAssist, an open-source clinical trials search engine.",
        transcript:
          "Hello! I am Priya Sharma, a final-year AI student at IIIT. Over the last two years, I have gravitated heavily toward generative AI...",
        timestamp: "2026-10-24T10:02:15Z",
        durationSeconds: 48,
        evaluation: {
          score: 92,
          criteriaScores: {
            technicalCorrectness: 90,
            relevanceCompleteness: 95,
            problemSolvingReasoning: 90,
            communicationClarity: 95,
            practicalApplication: 90,
          },
          explanation:
            "Clear, concise, and highly relevant introduction directly tying academic background to production RAG systems.",
          strengths: [
            "Eloquent introduction",
            "Immediate tie-in to practical domain experience",
            "Strong communication cadence",
          ],
          missingConcepts: [
            "Could mention long-term research aspirations or team collaboration style",
          ],
          improvedAnswer:
            "I am Priya Sharma, a final-year AI student at IIIT specializing in RAG architectures. My passion lies in engineering grounded AI pipelines that solve real enterprise accuracy problems. Having built biomedical search systems and fine-tuned 8B models, I am eager to contribute to collaborative engineering teams pushing applied GenAI boundaries.",
        },
      },
      {
        questionId: "q_aiml_2",
        questionText:
          "In your MediAssist project, why did you choose Reciprocal Rank Fusion (RRF) over simple vector similarity thresholding?",
        category: "technical",
        stage: 3,
        candidateAnswer:
          "Standard cosine distance thresholding often fails when queries contain specific clinical identifiers or rare drug synonyms that might have lower dense embedding proximity. By combining dense semantic search from ChromaDB with BM25 sparse keyword matching and using RRF with a constant k=60, we normalized rankings across two distinct score distributions. This gave us the semantic nuance of vectors along with exact keyword recall, lifting top-5 retrieval precision by 24%.",
        transcript:
          "Standard cosine distance thresholding often fails when queries contain specific clinical identifiers...",
        timestamp: "2026-10-24T10:08:40Z",
        durationSeconds: 72,
        evaluation: {
          score: 94,
          criteriaScores: {
            technicalCorrectness: 96,
            relevanceCompleteness: 95,
            problemSolvingReasoning: 94,
            communicationClarity: 92,
            practicalApplication: 94,
          },
          explanation:
            "Spot-on technical justification explaining hybrid search, dense vs sparse representations, and the mathematical purpose of RRF.",
          strengths: [
            "Exact understanding of hybrid search trade-offs",
            "Practical empirical metric citation (24% boost)",
            "Correct RRF parameter understanding (k=60)",
          ],
          missingConcepts: [
            "Could mention latency overhead introduced by dual-pass retrieval",
          ],
          improvedAnswer:
            "Pure vector distance can miss exact acronyms or clinical drug names. Combining dense embeddings with BM25 sparse search and fusing their ranks via RRF (k=60) eliminates score calibration issues between different metric spaces, ensuring both semantic breadth and exact-match precision at a modest latency cost.",
        },
      },
    ],
  },
  {
    id: "sess_demo_002",
    candidateId: "cand_alex_001",
    candidateName: "Alex Rivera",
    candidateEmail: "alex.rivera@example.edu",
    rollNumber: "22CS108",
    campaignId: "camp_frontend_2026",
    campaignTitle: "Frontend Engineering Campus Drive 2026",
    targetRole: "Frontend Developer",
    language: "en",
    difficulty: "intermediate",
    startTime: "2026-10-23T15:00:00Z",
    endTime: "2026-10-23T15:24:12Z",
    status: "completed",
    overallScore: 84,
    resumeMatchScore: 92,
    isDemo: true,
    hiringDecision: "under_review",
    recruiterNotes:
      "Good performance on React component lifecycles and Next.js App Router streaming concepts. Candidate needs slight coaching on advanced web worker concurrency.",
    integrityEvents: [],
    responses: [
      {
        questionId: "q_front_1",
        questionText:
          "How does Next.js 15 App Router handle streaming with React Server Components, and when would you use Suspense boundaries?",
        category: "technical",
        stage: 3,
        candidateAnswer:
          "In Next.js App Router, Server Components render on the server into React Server Component Payload. Streaming enables HTTP chunked transfer encoding so the browser receives the static shell immediately while asynchronous data fetching finishes in parallel. We wrap async data-heavy components inside Suspense with fallback skeletons, preventing slow database or API queries from blocking the entire page render.",
        transcript:
          "In Next.js App Router, Server Components render on the server into React Server Component Payload...",
        timestamp: "2026-10-23T15:06:10Z",
        durationSeconds: 55,
        evaluation: {
          score: 88,
          criteriaScores: {
            technicalCorrectness: 90,
            relevanceCompleteness: 88,
            problemSolvingReasoning: 85,
            communicationClarity: 90,
            practicalApplication: 86,
          },
          explanation:
            "Accurate explanation of HTTP chunked streaming, RSC payload, and user experience advantages of Suspense fallback skeletons.",
          strengths: [
            "Clear mental model of streaming",
            "Correct mention of chunked transfer encoding",
            "Focus on UX with fallback skeletons",
          ],
          missingConcepts: [
            "Could touch on how client-side hydration interacts with streamed HTML",
          ],
          improvedAnswer:
            "Next.js App Router utilizes React Server Components and HTTP chunked transfer encoding to stream HTML incrementally. Fast static layouts render instantaneously, while slow data-fetching nodes are wrapped in Suspense boundaries displaying loading skeletons, selectively hydrating pieces as they arrive.",
        },
      },
    ],
  },
];

export const SAMPLE_REPEAT_TESTS: RepeatTestItem[] = [
  {
    id: "rep_demo_001",
    sessionId: "sess_demo_001",
    candidateId: "cand_priya_002",
    candidateName: "Priya Sharma",
    originalQuestionId: "q_aiml_2",
    questionText:
      "In your MediAssist project, why did you choose Reciprocal Rank Fusion (RRF) over simple vector similarity thresholding?",
    originalAnswer:
      "Standard cosine distance thresholding often fails when queries contain specific clinical identifiers or rare drug synonyms that might have lower dense embedding proximity. By combining dense semantic search from ChromaDB with BM25 sparse keyword matching and using RRF with a constant k=60, we normalized rankings across two distinct score distributions. This gave us the semantic nuance of vectors along with exact keyword recall, lifting top-5 retrieval precision by 24%.",
    originalScore: 78,
    originalEvaluation: {
      score: 78,
      criteriaScores: {
        technicalCorrectness: 80,
        relevanceCompleteness: 75,
        problemSolvingReasoning: 78,
        communicationClarity: 80,
        practicalApplication: 75,
      },
      explanation:
        "Good preliminary answer, but lacked clear explanation of the mathematical normalization across non-comparable score ranges and latency considerations.",
      strengths: ["Identified vector search limitations", "Mentioned BM25 fusion"],
      missingConcepts: [
        "Score calibration mismatch",
        "Latency trade-offs of multi-pass retrieval",
      ],
      improvedAnswer:
        "Explain score calibration, parameter k tuning, and latency impacts.",
    },
    repeatAnswer:
      "Vector cosine similarity produces a bounded [0, 1] dense score, whereas BM25 produces an unbounded [0, infinity) term-frequency score. You cannot simply average or threshold them together without severe score calibration distortion. Reciprocal Rank Fusion solves this fundamentally: by converting raw scores into pure rank reciprocal values 1/(k + rank) with k=60, it provides rank-invariant fusion that is robust to scale differences. In MediAssist, this preserved exact clinical drug identifier precision while keeping dense contextual recall high, with only a 12ms round-trip latency overhead.",
    repeatScore: 94,
    repeatEvaluation: {
      score: 94,
      criteriaScores: {
        technicalCorrectness: 96,
        relevanceCompleteness: 95,
        problemSolvingReasoning: 94,
        communicationClarity: 92,
        practicalApplication: 94,
      },
      explanation:
        "Masterful second attempt clearly unpacking the score calibration problem, mathematical formulation of RRF, and empirical latency verification.",
      strengths: [
        "Precise mathematical formulation",
        "Deep understanding of scale distortion",
        "Concrete latency cost cited (12ms)",
      ],
      missingConcepts: [],
      improvedAnswer: "The repeat answer is already exemplary.",
    },
    scoreDifference: 16,
    improvementSummary:
      "Significant +16% improvement. Candidate directly addressed the missing concepts from the first attempt by providing the exact mathematical basis and latency cost.",
    dateCompleted: "2026-10-25T14:10:00Z",
  },
];

export const SAMPLE_CODING_PROBLEMS: CodingProblem[] = [
  {
    id: "prob_two_sum",
    title: "Two Sum Target Indices",
    difficulty: "Easy",
    category: "Arrays & Hash Maps",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    inputFormat: "nums: Array of integers, target: integer",
    outputFormat: "Array of two integer indices [i, j]",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    sampleCases: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].",
      },
    ],
    initialCode: {
      javascript: `function twoSum(nums, target) {
  // Write your O(n) solution using a Hash Map
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your O(n) solution using a dictionary
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    },
    testCases: [
      { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]" },
      { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]" },
      { input: "[3, 3], 6", expectedOutput: "[0, 1]" },
    ],
  },
  {
    id: "prob_valid_parens",
    title: "Valid Parentheses & Bracket Validation",
    difficulty: "Easy",
    category: "Stacks & Strings",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    inputFormat: "s: string",
    outputFormat: "boolean (true / false)",
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    sampleCases: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    initialCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    },
    testCases: [
      { input: '"()"', expectedOutput: "true" },
      { input: '"()[]{}"', expectedOutput: "true" },
      { input: '"(]"', expectedOutput: "false" },
      { input: '"([)]"', expectedOutput: "false" },
      { input: '"{[]}"', expectedOutput: "true" },
    ],
  },
];
