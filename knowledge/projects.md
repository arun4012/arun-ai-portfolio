# Projects

## 1. ECM – Documentum Modernization (Professional Project)

**Company:** Tata Consultancy Services (TCS)
**Client:** Prudential Finance
**Duration:** July 2023 – Present
**Role:** System Engineer / Angular Developer

### Description
Enterprise Content Management platform modernization project for Prudential Finance's insurance operations. The project involves migrating legacy .NET WebForms/MVC applications to modern Angular single-page applications.

### Business Context
Prudential Finance's records management system was built on legacy .NET WebForms and MVC technologies. The postback-based architecture caused performance issues, poor user experience, and high maintenance costs. The modernization initiative aims to rebuild the front-end using Angular while preserving the existing .NET backend services.

### Technology Stack
- **Frontend:** Angular 15–21, TypeScript, Angular Material, Angular CDK, Bootstrap 5, SCSS
- **Backend:** .NET (existing), REST APIs
- **Database:** Microsoft SQL Server
- **ECM Platform:** OpenText Documentum
- **State Management:** RxJS Subjects, BehaviorSubjects, service-based state
- **Charts:** Chart.js
- **i18n:** ngx-translate
- **Testing:** Jasmine, Karma
- **CI/CD:** GitHub Actions, JFrog Artifactory
- **Tools:** Git, Jira, VS Code, Angular CLI

### Architecture
- Single-page application architecture replacing server-rendered postback pages
- Component-driven design with 40+ reusable components
- Lazy-loaded feature modules with PreloadAllModules strategy
- Role-based access control with conditional UI rendering
- Multi-stage approval workflows
- REST API integration using Angular HttpClient with RxJS operators

### Key Responsibilities
- Migrating legacy .NET front-end modules to Angular 15+
- Developing and maintaining 40+ reusable Angular components
- Building responsive, cross-browser UI
- Implementing state management with RxJS
- Integrating REST APIs with error handling
- Building complex dynamic forms with custom validation
- Optimizing front-end performance
- Implementing internationalization (i18n)
- Developing audit dashboards with Chart.js
- Writing unit tests with Jasmine and Karma
- Supporting CI/CD pipelines

### Challenges & Solutions
1. **Challenge:** Legacy postback pages caused slow page loads and poor UX.
   **Solution:** Migrated to Angular SPA with lazy loading and preloading, reducing page load times by 20%.

2. **Challenge:** Large datasets caused UI freezes during table operations.
   **Solution:** Implemented Angular CDK virtual scrolling and offloaded filtering/sorting to Web Workers.

3. **Challenge:** Complex approval workflows with varying business rules per department.
   **Solution:** Built configurable role-based routing and conditional UI rendering driven by Business Unit and Functional Group requirements.

4. **Challenge:** Maintaining consistency across multiple languages.
   **Solution:** Implemented ngx-translate with runtime language switching supporting English, Spanish, and Japanese.

### Outcomes
- 20% reduction in page load times
- 30% reduction in manual deployment effort through CI/CD automation
- Measurable reduction in invalid form submissions through client-side validation
- Improved application responsiveness on data-heavy screens

---

## 2. Arun AI Portfolio (Personal Project)

**Type:** Personal Project
**Duration:** November 2026
**Role:** Full-Stack Developer

### Description
A responsive personal portfolio website with an integrated AI-powered chatbot using Retrieval-Augmented Generation (RAG). The chatbot acts as a virtual professional representative, answering questions about professional background using verified portfolio information.

### Business Context
Traditional portfolios provide static information. This project demonstrates both frontend engineering expertise and practical Generative AI implementation by combining a professional portfolio with an interactive AI assistant.

### Technology Stack
- **Frontend:** Angular 18, TypeScript, Tailwind CSS, Lucide icons
- **Backend:** Cloudflare Pages Functions
- **AI/LLM:** Cloudflare Workers AI (GLM-4.7-flash)
- **Embeddings:** BAAI BGE (bge-base-en-v1.5)
- **Retrieval:** Cosine similarity over JSON vector index
- **Hosting:** Cloudflare Pages (free tier)
- **Source Control:** GitHub

### Architecture
- Angular SPA with responsive design for all screen sizes
- Floating chatbot accessible from all pages
- Cloudflare Pages Functions for serverless API
- RAG pipeline: document chunking → embedding generation → vector index → semantic retrieval → LLM response
- Structured profile retrieval for factual fields (notice period, availability, contact info)
- System prompt engineering for grounded, professional responses

### Key Features
- 8 portfolio sections (Hero, About, Skills, Experience, Projects, Certifications, Contact, Footer)
- AI chatbot with suggested questions and conversation history
- Resume download functionality
- Zero-cost deployment using free tiers
- Mobile-first responsive design

### Challenges & Solutions
1. **Challenge:** Zero-budget constraint for all services.
   **Solution:** Used Cloudflare's free tier for hosting, AI inference, and embeddings; static JSON for vector storage.

2. **Challenge:** Preventing AI hallucination about professional details.
   **Solution:** Implemented RAG with structured profile retrieval and strict system prompt instructions.

