/**
 * Cloudflare Worker: Entry point for Arun AI Portfolio
 * Handles /api/chat and /api/health, and delegates all other requests
 * to the Angular SPA static assets.
 */

interface Env {
  AI?: any;
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

interface ChatRequest {
  question: string;
  history?: { role: string; content: string }[];
}

interface KnowledgeChunk {
  id: string;
  source: string;
  section: string;
  text: string;
  embedding?: number[];
}

interface KnowledgeIndex {
  chunks: KnowledgeChunk[];
  generated: string;
  hasRealEmbeddings?: boolean;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const STRUCTURED_PROFILE = {
  fullName: 'Arun Arivalagan',
  currentRole: 'System Engineer',
  currentCompany: 'Tata Consultancy Services (TCS)',
  client: 'Prudential Finance',
  project: 'ECM – Documentum Modernization',
  experienceYears: '3+',
  noticePeriod: '90 days',
  availability: 'Available after notice period',
  location: 'Salem, India',
  email: 'arunariraja@gmail.com',
  linkedin: 'https://linkedin.com/in/arunarivalagan',
  github: 'https://github.com/arun4012',
  education: 'B.E. Electronics and Communication Engineering, M. Kumarasamy College of Engineering, Karur (2019–2023), CGPA: 8.8/10 (Distinction)',
  certifications: [
    'Kubernetes and Cloud Native Associate (KCNA) - CNCF',
    'Prompt Engineering for Generative AI - Udemy',
    'AWS Certified Solutions Architect Associate (SAA-C03) - In Progress'
  ],
  topSkills: [
    'Angular (15–21)',
    'TypeScript & JavaScript (ES6+)',
    'RxJS & State Management',
    'Angular Material & CDK',
    'REST API Integration & HttpClient',
    'HTML5, SCSS & Tailwind CSS',
    'Azure DevOps & Git',
    'Kubernetes (KCNA)'
  ]
};

/**
 * Score chunks based on keyword matching when vector embeddings are not populated
 */
function retrieveChunksByKeywords(question: string, chunks: KnowledgeChunk[], topK = 4): KnowledgeChunk[] {
  const terms = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (terms.length === 0 || !chunks || chunks.length === 0) return [];

  const scored = chunks.map(chunk => {
    const hay = ((chunk.section || '') + ' ' + (chunk.text || '')).toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (hay.includes(term)) {
        score += 1;
        // boost if match in section title
        if ((chunk.section || '').toLowerCase().includes(term)) {
          score += 2;
        }
      }
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).slice(0, topK).map(s => s.chunk);
}

function buildSystemPrompt(retrievedContext: KnowledgeChunk[]): string {
  const contextText = retrievedContext.length > 0
    ? retrievedContext.map(c => `[Source: ${c.source} - ${c.section}]\n${c.text}`).join('\n\n---\n\n')
    : 'No additional chunk matched. Use ground truth profile below.';

  return `You are Arun's professional portfolio AI assistant. Answer questions about Arun Arivalagan accurately, concisely, and professionally.

STRICT GUIDELINES:
- Answer ONLY questions about Arun's career, technical skills, projects, certifications, education, and availability.
- Ground your answers in the structured profile and retrieved facts. Do not invent details.
- Arun's NOTICE PERIOD is strictly 90 days.
- Current employer: Tata Consultancy Services (TCS), Role: System Engineer.
- Client: Prudential Finance, Project: ECM – Documentum Modernization.
- Primary expertise: Angular (15-21), TypeScript, RxJS, Angular Material, REST APIs.
- Keep responses friendly, recruiter-friendly, and concise (1-3 brief paragraphs or bullet points).
- For contact, provide email (arunariraja@gmail.com) and LinkedIn.

GROUND TRUTH PROFILE:
Name: ${STRUCTURED_PROFILE.fullName}
Role: ${STRUCTURED_PROFILE.currentRole} @ ${STRUCTURED_PROFILE.currentCompany}
Client: ${STRUCTURED_PROFILE.client} (Project: ${STRUCTURED_PROFILE.project})
Experience: ${STRUCTURED_PROFILE.experienceYears} years
Notice Period: ${STRUCTURED_PROFILE.noticePeriod} (${STRUCTURED_PROFILE.availability})
Location: ${STRUCTURED_PROFILE.location}
Email: ${STRUCTURED_PROFILE.email}
LinkedIn: ${STRUCTURED_PROFILE.linkedin}
GitHub: ${STRUCTURED_PROFILE.github}
Education: ${STRUCTURED_PROFILE.education}
Certifications: ${STRUCTURED_PROFILE.certifications.join(', ')}
Key Skills: ${STRUCTURED_PROFILE.topSkills.join(', ')}

KNOWLEDGE CONTEXT:
${contextText}`;
}

/**
 * Intelligent instant answer fallback if LLM is unavailable or times out
 */
function getDeterministicFallbackAnswer(question: string): { answer: string; sources: string[] } {
  const q = question.toLowerCase();

  if (q.includes('notice') || q.includes('availability') || q.includes('available') || q.includes('join')) {
    return {
      answer: `Arun's official notice period is **90 days**. He is currently employed at Tata Consultancy Services (TCS) and will be available to join a new organization following his notice period. For expedited discussions, you can reach him directly at **${STRUCTURED_PROFILE.email}**.`,
      sources: ['profile', 'faq']
    };
  }

  if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('framework')) {
    return {
      answer: `Arun is a frontend-focused System Engineer with **3+ years** of professional experience. His primary technical stack includes:\n\n` +
        `• **Frontend:** Angular (15–21), TypeScript, JavaScript (ES6+), HTML5, CSS3/SCSS, Tailwind CSS\n` +
        `• **UI & Reactive:** Angular Material, Angular CDK, RxJS, Bootstrap 5\n` +
        `• **Architecture & APIs:** REST API Integration, HttpClient, Reusable Component Architecture\n` +
        `• **Cloud & DevOps:** Kubernetes (KCNA certified), Azure DevOps CI/CD, Git\n` +
        `• **AI & Dev Tools:** Prompt Engineering, Generative AI Application Development`,
      sources: ['skills', 'experience']
    };
  }

  if (q.includes('project') || q.includes('ecm') || q.includes('documentum') || q.includes('prudential')) {
    return {
      answer: `Arun is currently leading frontend modernization on the **ECM – Documentum Modernization** project at TCS for **Prudential Finance**:\n\n` +
        `• Migrated enterprise legacy .NET WebForms/MVC modules into modern, high-performance Angular applications.\n` +
        `• Built role-based access workflows, audit dashboards with Chart.js, and reusable component libraries.\n` +
        `• Integrated REST APIs with automated CI/CD pipelines in Azure DevOps.\n\n` +
        `He also developed this **AI-Powered Portfolio** leveraging Angular 18, Tailwind CSS, Cloudflare Workers AI, and a RAG pipeline.`,
      sources: ['projects', 'experience']
    };
  }

  if (q.includes('certif') || q.includes('kcna') || q.includes('aws') || q.includes('course')) {
    return {
      answer: `Arun holds the following certifications:\n\n` +
        `1. **Kubernetes and Cloud Native Associate (KCNA)** – CNCF\n` +
        `2. **Prompt Engineering for Generative AI** – Udemy\n` +
        `3. **AWS Certified Solutions Architect Associate (SAA-C03)** – Currently in progress`,
      sources: ['certifications']
    };
  }

  if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('phone') || q.includes('linkedin')) {
    return {
      answer: `You can connect with Arun directly through:\n\n` +
        `• **Email:** [${STRUCTURED_PROFILE.email}](mailto:${STRUCTURED_PROFILE.email})\n` +
        `• **LinkedIn:** [linkedin.com/in/arunarivalagan](${STRUCTURED_PROFILE.linkedin})\n` +
        `• **GitHub:** [github.com/arun4012](${STRUCTURED_PROFILE.github})\n` +
        `• **Location:** Salem / Chennai, India`,
      sources: ['profile']
    };
  }

  if (q.includes('experience') || q.includes('tcs') || q.includes('role') || q.includes('work') || q.includes('introduce') || q.includes('who is')) {
    return {
      answer: `**Arun Arivalagan** is a **System Engineer / Angular Developer** at Tata Consultancy Services (TCS) with **3+ years** of professional experience in enterprise web applications.\n\n` +
        `He specializes in modernizing legacy architectures into responsive Angular single-page applications, with deep expertise in TypeScript, RxJS, REST API integration, and clean component design. He graduated with a B.E. (Distinction, 8.8 CGPA) in 2023 and is KCNA certified.`,
      sources: ['experience', 'profile']
    };
  }

  return {
    answer: `Arun Arivalagan is a System Engineer at TCS with 3+ years of experience specializing in Angular, TypeScript, and modern frontend architecture. His notice period is 90 days. You can ask about his skills, projects, certifications, or reach him directly at ${STRUCTURED_PROFILE.email}.`,
    sources: ['profile']
  };
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let question = '';

  try {
    const body = (await request.json()) as ChatRequest;
    question = (body.question || '').trim().slice(0, 500);
    const history = (body.history || []).slice(-4);

    if (!question) {
      return new Response(JSON.stringify({ error: 'Please enter a question.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch knowledge index from static assets
    let knowledgeIndex: KnowledgeIndex = { chunks: [], generated: '' };
    try {
      const indexReq = new Request(new URL('/knowledge-index.json', request.url));
      const indexRes = await env.ASSETS.fetch(indexReq);
      if (indexRes.ok) {
        knowledgeIndex = (await indexRes.json()) as KnowledgeIndex;
      }
    } catch (err) {
      console.warn('Could not load knowledge-index.json from assets:', err);
    }

    // 2. Retrieve relevant context chunks using fast keyword match
    const retrievedChunks = retrieveChunksByKeywords(question, knowledgeIndex.chunks || [], 3);
    const sources = [...new Set(retrievedChunks.map(c => c.source))];
    if (sources.length === 0) sources.push('profile');

    // 3. Try LLM generation via Workers AI with fast models and fallback
    let answer = '';

    if (env.AI) {
      const systemPrompt = buildSystemPrompt(retrievedChunks);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.filter(h => h.role === 'user' || h.role === 'assistant'),
        { role: 'user', content: question },
      ];

      // Ordered list of models: prefer fastest Llama 3.1 8B, then Llama 3 8B, then GLM
      const candidateModels = [
        '@cf/meta/llama-3.1-8b-instruct',
        '@cf/meta/llama-3-8b-instruct',
        '@cf/zai-org/glm-4.7-flash',
      ];

      for (const model of candidateModels) {
        try {
          const llmResponse = (await env.AI.run(model, {
            messages,
            max_tokens: 350,
            temperature: 0.3,
          })) as any;

          const candidateAnswer =
            llmResponse?.response ||
            llmResponse?.result?.response ||
            (typeof llmResponse === 'string' ? llmResponse : '');

          if (candidateAnswer && candidateAnswer.trim().length > 10) {
            answer = candidateAnswer.trim();
            break;
          }
        } catch (modelErr: any) {
          console.warn(`Model ${model} failed or timed out:`, modelErr);
        }
      }
    }

    // 4. If AI is not bound, quota exhausted, or models failed, use smart instant fallback
    if (!answer) {
      const fallback = getDeterministicFallbackAnswer(question);
      answer = fallback.answer;
      if (fallback.sources.length > 0) {
        sources.push(...fallback.sources);
      }
    }

    return new Response(
      JSON.stringify({
        answer,
        sources: [...new Set(sources)],
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Chat worker error:', error);
    const fallback = getDeterministicFallbackAnswer(question || 'general');
    return new Response(
      JSON.stringify({
        answer: fallback.answer,
        sources: fallback.sources || ['profile'],
        debugError: error?.message || String(error),
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    // Serve static frontend assets for all other routes
    return env.ASSETS.fetch(request);
  },
};
