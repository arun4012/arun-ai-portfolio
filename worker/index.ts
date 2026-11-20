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
  location: 'Salem / Chennai, India',
  email: 'arunariraja@gmail.com',
  linkedin: 'https://linkedin.com/in/arunarivalagan',
  github: 'https://github.com/arun4012',
  education: 'B.E. Electronics and Communication Engineering, M. Kumarasamy College of Engineering, Karur (2019–2023), CGPA: 8.8/10 (First Class with Distinction)',
  certifications: [
    'Kubernetes and Cloud Native Associate (KCNA) - Cloud Native Computing Foundation (CNCF)',
    'Prompt Engineering for Generative AI - Udemy',
    'AWS Certified Solutions Architect Associate (SAA-C03) - Currently in progress'
  ],
  topSkills: [
    'Angular (15–21)',
    'TypeScript & JavaScript (ES6+)',
    'RxJS & State Management',
    'Angular Material & Angular CDK',
    'REST API Integration & HttpClient',
    'HTML5, SCSS & Tailwind CSS',
    'Azure DevOps Pipelines & Git',
    'Kubernetes (KCNA)'
  ]
};

function retrieveChunksByKeywords(question: string, chunks: KnowledgeChunk[], topK = 3): KnowledgeChunk[] {
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
- For contact, provide email (${STRUCTURED_PROFILE.email}) and LinkedIn (${STRUCTURED_PROFILE.linkedin}).

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
 * High-precision instant answer engine
 */
function getDeterministicFallbackAnswer(question: string): { answer: string; sources: string[] } {
  const q = question.toLowerCase();

  // 1. Notice period & Availability
  if (q.includes('notice') || q.includes('availab') || q.includes('period') || q.includes('join') || q.includes('start') || q.includes('immediate') || q.includes('offer')) {
    return {
      answer: `Arun's official notice period is **90 days**. He is currently employed at Tata Consultancy Services (TCS) and is actively exploring new opportunities. He will be available to join following his notice period. For urgent hiring requirements or direct discussions, you can reach him at **${STRUCTURED_PROFILE.email}**.`,
      sources: ['profile', 'faq']
    };
  }

  // 2. Technical Skills & Tools
  if (q.includes('skill') || q.includes('technolog') || q.includes('tech') || q.includes('stack') || q.includes('framework') || q.includes('frontend') || q.includes('angular') || q.includes('typescript') || q.includes('rxjs') || q.includes('tool') || q.includes('tailwind')) {
    return {
      answer: `Arun has **3+ years** of professional experience with enterprise frontend technologies:\n\n` +
        `• **Frontend Core:** Angular (15–21), TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Tailwind CSS\n` +
        `• **UI Libraries:** Angular Material, Angular CDK, Bootstrap 5, ng-bootstrap\n` +
        `• **Reactive Programming:** RxJS (Observables, Subjects, custom operators), Service-based State Management\n` +
        `• **API & Architecture:** RESTful APIs, HttpClient, Modular & Reusable Component Architecture\n` +
        `• **Cloud & DevOps:** Kubernetes (KCNA Certified), Azure DevOps CI/CD, Git & GitHub\n` +
        `• **AI Engineering:** Prompt Engineering, Generative AI Application Development (RAG pipelines)`,
      sources: ['skills', 'experience']
    };
  }

  // 3. Projects
  if (q.includes('project') || q.includes('ecm') || q.includes('documentum') || q.includes('prudential') || q.includes('portfolio') || q.includes('build')) {
    return {
      answer: `Arun has spearheaded major enterprise frontend projects:\n\n` +
        `1. **ECM – Documentum Modernization (TCS / Prudential Finance):**\n` +
        `   • Modernized legacy .NET WebForms and MVC modules into modern Angular SPAs.\n` +
        `   • Built role-based workflow engines, audit visualization dashboards with Chart.js, and standardized UI libraries.\n` +
        `   • Integrated complex REST APIs with automated Azure DevOps CI/CD pipelines.\n\n` +
        `2. **AI-Powered Portfolio (Personal Project):**\n` +
        `   • Designed an interactive portfolio using Angular 18, Tailwind CSS, and Cloudflare Workers AI with RAG retrieval.\n` +
        `   • Engineered zero-cost deployment architecture with sub-second response times.`,
      sources: ['projects', 'experience']
    };
  }

  // 4. Certifications
  if (q.includes('certif') || q.includes('kcna') || q.includes('kubernetes') || q.includes('aws') || q.includes('exam') || q.includes('course') || q.includes('credential')) {
    return {
      answer: `Arun holds the following industry certifications:\n\n` +
        `• **Kubernetes and Cloud Native Associate (KCNA):** Issued by Cloud Native Computing Foundation (CNCF) — validates cloud-native architecture and container orchestration.\n` +
        `• **Prompt Engineering for Generative AI:** Issued by Udemy — covers LLM orchestration, chain-of-thought, and RAG architectures.\n` +
        `• **AWS Certified Solutions Architect – Associate (SAA-C03):** Currently in progress, focusing on scalable cloud system design.`,
      sources: ['certifications']
    };
  }

  // 5. Contact & Socials
  if (q.includes('contact') || q.includes('email') || q.includes('mail') || q.includes('reach') || q.includes('phone') || q.includes('mobile') || q.includes('linkedin') || q.includes('github') || q.includes('hire') || q.includes('resume')) {
    return {
      answer: `You can connect with Arun directly through:\n\n` +
        `• **Email:** [${STRUCTURED_PROFILE.email}](mailto:${STRUCTURED_PROFILE.email})\n` +
        `• **LinkedIn:** [linkedin.com/in/arunarivalagan](${STRUCTURED_PROFILE.linkedin})\n` +
        `• **GitHub:** [github.com/arun4012](${STRUCTURED_PROFILE.github})\n` +
        `• **Resume:** Available for direct PDF download via the buttons on the portfolio page.`,
      sources: ['profile']
    };
  }

  // 6. Education
  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('b.e') || q.includes('engineering') || q.includes('cgpa') || q.includes('university') || q.includes('kumarasamy')) {
    return {
      answer: `Arun completed his **Bachelor of Engineering (B.E.)** in **Electronics and Communication Engineering** from **M. Kumarasamy College of Engineering, Karur** (2019–2023), graduating with **First Class with Distinction** and a **CGPA of 8.8/10**.`,
      sources: ['profile', 'about']
    };
  }

  // 7. Strengths
  if (q.includes('strength') || q.includes('strong') || q.includes('why hire') || q.includes('specializ')) {
    return {
      answer: `Arun's key professional strengths include:\n\n` +
        `• **Enterprise Modernization:** Proven track record transforming legacy monoliths into clean, modular Angular applications.\n` +
        `• **Performance Optimization:** Skilled in lazy loading, trackBy, RxJS memory leak prevention, and bundle optimization.\n` +
        `• **Full Lifecycle Execution:** From UI/UX component development to REST API integration and Azure DevOps deployment.\n` +
        `• **Modern AI Integration:** Practical understanding of LLM prompt engineering, RAG pipelines, and edge computing.`,
      sources: ['skills', 'faq']
    };
  }

  // 8. General Experience / Introduction / Overview
  return {
    answer: `**Arun Arivalagan** is a **System Engineer / Angular Developer** at Tata Consultancy Services (TCS) with **3+ years** of hands-on experience building enterprise web applications.\n\n` +
      `He specializes in Angular (v15–21), TypeScript, RxJS, and clean component architectures. He is currently working on the ECM modernization project for Prudential Finance and is KCNA certified. His notice period is **90 days**. Feel free to ask about his skills, projects, or reach him at **${STRUCTURED_PROFILE.email}**.`,
    sources: ['experience', 'profile']
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

    // 1. Fetch knowledge index from static assets (non-blocking)
    let knowledgeIndex: KnowledgeIndex = { chunks: [], generated: '' };
    try {
      const indexReq = new Request(new URL('/knowledge-index.json', request.url));
      const indexRes = await env.ASSETS.fetch(indexReq);
      if (indexRes.ok) {
        knowledgeIndex = (await indexRes.json()) as KnowledgeIndex;
      }
    } catch { }

    // 2. Retrieve relevant context chunks using fast keyword match
    const retrievedChunks = retrieveChunksByKeywords(question, knowledgeIndex.chunks || [], 3);
    const sources = [...new Set(retrievedChunks.map(c => c.source))];
    if (sources.length === 0) sources.push('profile');

    // 3. Try LLM generation via Workers AI with strict 4.5s timeout per attempt
    let answer = '';

    if (env.AI) {
      const systemPrompt = buildSystemPrompt(retrievedChunks);
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.filter(h => h.role === 'user' || h.role === 'assistant'),
        { role: 'user', content: question },
      ];

      // Test fastest lightweight models with timeout race
      const candidateModels = [
        '@cf/meta/llama-3.1-8b-instruct',
        '@cf/meta/llama-3-8b-instruct',
      ];

      for (const model of candidateModels) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI timeout')), 4500)
          );

          const aiPromise = env.AI.run(model, {
            messages,
            max_tokens: 280,
            temperature: 0.3,
          });

          const llmResponse = (await Promise.race([aiPromise, timeoutPromise])) as any;

          const candidateAnswer =
            llmResponse?.response ||
            llmResponse?.result?.response ||
            (typeof llmResponse === 'string' ? llmResponse : '');

          if (candidateAnswer && candidateAnswer.trim().length > 10) {
            answer = candidateAnswer.trim();
            break;
          }
        } catch { }
      }
    }

    // 4. If AI is not bound, quota exhausted, or models timed out, use instant fallback
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
    const fallback = getDeterministicFallbackAnswer(question || 'general');
    return new Response(
      JSON.stringify({
        answer: fallback.answer,
        sources: fallback.sources || ['profile'],
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
