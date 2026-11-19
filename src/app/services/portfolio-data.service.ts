import { Injectable } from '@angular/core';
import {
  Profile,
  SkillCategory,
  Experience,
  Project,
  Certification,
  SuggestedQuestion,
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  readonly profile: Profile = {
    name: 'Arun A.',
    fullName: 'Arun Arivalagan',
    currentCompany: 'Tata Consultancy Services (TCS)',
    currentRole: 'System Engineer',
    primarySpecialization: 'Angular Development',
    designation: 'System Engineer / Angular Developer',
    phone: '+91 9361483484',
    email: 'arunariraja@gmail.com',
    linkedin: 'https://linkedin.com/in/arunarivalagan',
    github: 'https://github.com/arunarivalagan',
    location: 'Salem, India',
    experienceYears: '3+',
    joiningDate: 'July 2023',
    client: 'Prudential Finance',
    project: 'ECM – Documentum Modernization',
    noticePeriod: '90 days',
    availability: 'Available after notice period',
    education: {
      degree: 'B.E. Electronics and Communication Engineering',
      institution: 'M. Kumarasamy College of Engineering, Karur',
      year: '2019 – 2023',
      cgpa: '8.8 / 10 (Distinction)',
    },
    summary:
      'Software Engineer with 3+ years of experience building enterprise Angular applications in the insurance and financial services domain. Experienced in migrating legacy .NET front-ends to Angular, component-driven architecture, RxJS-based state management, REST API integration, and responsive UI development with Angular Material and Bootstrap.',
    lastUpdated: '2026-11-19',
  };

  readonly skillCategories: SkillCategory[] = [
    {
      category: 'Frontend',
      icon: 'code-2',
      skills: [
        { name: 'Angular 15–21', items: ['Components', 'Routing', 'Lazy Loading', 'Reactive Forms', 'Directives', 'Pipes', 'i18n'], level: 'professional' },
        { name: 'TypeScript', items: ['ES6+', 'Interfaces', 'Generics', 'Decorators'], level: 'professional' },
        { name: 'JavaScript (ES6+)', items: ['Async/Await', 'Modules', 'DOM'], level: 'professional' },
        { name: 'HTML5 & CSS3/SCSS', items: ['Semantic', 'Flexbox', 'Grid', 'Responsive'], level: 'professional' },
      ],
    },
    {
      category: 'UI Libraries',
      icon: 'palette',
      skills: [
        { name: 'Angular Material', items: ['Components', 'Theming', 'CDK'], level: 'professional' },
        { name: 'Bootstrap 5', items: ['Grid', 'Components', 'Utilities'], level: 'professional' },
        { name: 'Angular CDK', items: ['Virtual Scrolling', 'Overlays', 'A11y'], level: 'professional' },
        { name: 'ng-bootstrap', items: ['Widgets', 'Modals'], level: 'professional' },
      ],
    },
    {
      category: 'Reactive & State',
      icon: 'activity',
      skills: [
        { name: 'RxJS', items: ['Observables', 'Subjects', 'BehaviorSubject', 'switchMap', 'catchError'], level: 'professional' },
        { name: 'Service-based State', items: ['Shared Services', 'Cross-component'], level: 'professional' },
        { name: 'NgRx', items: ['Store', 'Effects', 'Selectors'], level: 'basic' },
      ],
    },
    {
      category: 'API & Integration',
      icon: 'plug',
      skills: [
        { name: 'REST APIs', items: ['Design', 'Consumption', 'Error Handling'], level: 'professional' },
        { name: 'Angular HttpClient', items: ['Interceptors', 'RxJS Operators'], level: 'professional' },
      ],
    },
    {
      category: 'Testing',
      icon: 'check-circle',
      skills: [
        { name: 'Jasmine & Karma', items: ['Unit Tests', 'Component Tests'], level: 'professional' },
        { name: 'Regression Testing', items: ['Manual', 'Automated'], level: 'professional' },
      ],
    },
    {
      category: 'Tools & DevOps',
      icon: 'wrench',
      skills: [
        { name: 'Git & GitHub', items: ['PRs', 'Code Reviews', 'Actions'], level: 'professional' },
        { name: 'Azure DevOps / Jira', items: ['Sprints', 'Boards', 'Tracking'], level: 'professional' },
        { name: 'CI/CD', items: ['GitHub Actions', 'JFrog Artifactory'], level: 'professional' },
      ],
    },
    {
      category: 'Cloud & DevOps',
      icon: 'cloud',
      skills: [
        { name: 'Kubernetes (KCNA)', items: ['Containers', 'Orchestration', 'CNCF'], level: 'learning' },
        { name: 'AWS', items: ['SAA-C03 In Progress', 'Cloud Fundamentals'], level: 'learning' },
      ],
    },
    {
      category: 'AI & Dev Tools',
      icon: 'sparkles',
      skills: [
        { name: 'Prompt Engineering', items: ['System Prompts', 'RAG', 'LLMs'], level: 'professional' },
        { name: 'AI-Assisted Dev', items: ['Claude Code', 'GitHub Copilot'], level: 'professional' },
        { name: 'Generative AI', items: ['LLM Integration', 'Embeddings', 'RAG Pipeline'], level: 'learning' },
      ],
    },
  ];

  readonly experiences: Experience[] = [
    {
      role: 'System Engineer',
      company: 'Tata Consultancy Services (TCS)',
      client: 'Prudential Finance',
      project: 'ECM – Documentum Modernization',
      duration: 'July 2023 – Present',
      location: 'Chennai, India',
      description:
        'Migrating legacy .NET WebForms/MVC front-end modules to modern Angular single-page applications for an Enterprise Content Management platform (OpenText Documentum) used for records management in the insurance domain.',
      responsibilities: [
        'Migrated legacy .NET (ASP.NET WebForms/MVC) front-end modules into Angular 15+',
        'Developed and maintained 40+ reusable Angular components',
        'Built responsive, cross-browser UI using Angular Material, CDK, Bootstrap 5, and SCSS',
        'Implemented cross-component state management using RxJS Subjects and BehaviorSubjects',
        'Integrated REST APIs using Angular HttpClient with RxJS operators',
        'Wrote SQL queries against Microsoft SQL Server for validation and debugging',
        'Implemented role-based access control and multi-stage approval workflows',
        'Built complex dynamic forms with Angular Reactive Forms and custom validators',
        'Optimized performance with lazy loading, OnPush detection, and virtual scrolling',
        'Implemented internationalization with ngx-translate (English, Spanish, Japanese)',
        'Developed audit dashboards using Chart.js with drill-down and Excel export',
        'Developed unit tests with Jasmine and Karma',
        'Supported CI/CD pipelines with GitHub Actions and JFrog Artifactory',
        'Applied AI-assisted development with Claude Code and GitHub Copilot',
      ],
      achievements: [
        'Reduced page load times by 20% through lazy loading and optimization',
        'Improved form data accuracy with structured validation and error handling',
        'Reduced manual deployment effort by 30% through CI/CD automation',
        'Participated in TCS Generative AI Hackathon',
      ],
      technologies: [
        'Angular 15–21', 'TypeScript', 'Angular Material', 'Angular CDK',
        'Bootstrap 5', 'SCSS', 'RxJS', 'Chart.js', 'ngx-translate',
        'REST APIs', 'Microsoft SQL Server', 'Jasmine', 'Karma',
        'GitHub Actions', 'JFrog Artifactory', 'Git', 'Jira',
      ],
    },
  ];

  readonly projects: Project[] = [
    {
      title: 'ECM – Documentum Modernization',
      type: 'professional',
      company: 'Tata Consultancy Services (TCS)',
      client: 'Prudential Finance',
      duration: 'July 2023 – Present',
      role: 'System Engineer / Angular Developer',
      description:
        'Enterprise Content Management platform modernization for Prudential Finance\'s insurance operations, migrating legacy .NET WebForms/MVC to Angular SPAs.',
      businessContext:
        'Prudential Finance\'s records management system was built on legacy .NET. The postback-based architecture caused performance issues and high maintenance costs. The modernization rebuilds the front-end using Angular.',
      technologies: [
        'Angular 15–21', 'TypeScript', 'Angular Material', 'Angular CDK',
        'Bootstrap 5', 'SCSS', 'RxJS', 'Chart.js', 'ngx-translate',
        'REST APIs', 'SQL Server', 'Jasmine', 'Karma', 'GitHub Actions',
      ],
      responsibilities: [
        'Migrating legacy .NET front-end modules to Angular 15+',
        'Developing and maintaining 40+ reusable Angular components',
        'Building responsive, cross-browser UI',
        'Implementing state management with RxJS',
        'Building complex dynamic forms with custom validation',
        'Optimizing front-end performance',
        'Developing audit dashboards with Chart.js',
      ],
      challenges: [
        {
          challenge: 'Legacy postback pages caused slow loads and poor UX',
          solution: 'Migrated to Angular SPA with lazy loading and preloading, reducing load times by 20%',
        },
        {
          challenge: 'Large datasets caused UI freezes during table operations',
          solution: 'Implemented Angular CDK virtual scrolling and offloaded filtering to Web Workers',
        },
        {
          challenge: 'Complex approval workflows with varying business rules per department',
          solution: 'Built configurable role-based routing and conditional UI rendering',
        },
      ],
      outcomes: [
        '20% reduction in page load times',
        '30% reduction in manual deployment effort',
        'Measurable reduction in invalid form submissions',
        'Improved responsiveness on data-heavy screens',
      ],
      featured: true,
    },
    {
      title: 'Arun AI Portfolio',
      type: 'personal',
      duration: 'November 2026',
      role: 'Full-Stack Developer',
      description:
        'Personal portfolio with an AI-powered chatbot using RAG, demonstrating frontend engineering and Generative AI skills.',
      businessContext:
        'Combining a professional portfolio with an interactive AI assistant to provide context-aware answers about professional background.',
      technologies: [
        'Angular 18', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages',
        'Cloudflare Workers AI', 'BAAI BGE Embeddings', 'RAG Pipeline',
        'Lucide Icons',
      ],
      responsibilities: [
        'Full-stack development of portfolio and AI chatbot',
        'RAG pipeline implementation (chunking, embedding, retrieval)',
        'System prompt engineering for grounded responses',
        'Zero-cost deployment on Cloudflare free tier',
      ],
      challenges: [
        {
          challenge: 'Zero-budget constraint for all services',
          solution: 'Used Cloudflare free tier for hosting, AI inference, and embeddings',
        },
        {
          challenge: 'Preventing AI hallucination about professional details',
          solution: 'RAG with structured profile retrieval and strict system prompt instructions',
        },
      ],
      outcomes: [
        'Fully functional portfolio with AI chatbot',
        'Zero recurring cost deployment',
        'Demonstrates full-stack + GenAI capabilities',
      ],
      featured: true,
    },
  ];

  readonly certifications: Certification[] = [
    {
      name: 'Kubernetes and Cloud Native Associate (KCNA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      status: 'completed',
      description:
        'Foundational knowledge of Kubernetes and the cloud-native ecosystem, including container orchestration and CNCF landscape.',
    },
    {
      name: 'Prompt Engineering for Generative AI',
      issuer: 'Udemy',
      status: 'completed',
      description:
        'Techniques for effective prompt engineering with LLMs, including chain-of-thought prompting and practical applications.',
    },
    {
      name: 'AWS Certified Solutions Architect Associate (SAA-C03)',
      issuer: 'Amazon Web Services (AWS)',
      status: 'in-progress',
      description:
        'Validates design of distributed systems on AWS. Currently preparing for the exam.',
    },
  ];

  readonly suggestedQuestions: SuggestedQuestion[] = [
    { text: 'Introduce Arun', icon: 'user' },
    { text: 'What is his experience with Angular?', icon: 'code-2' },
    { text: 'Explain his current project', icon: 'briefcase' },
    { text: 'What technologies has he worked with?', icon: 'layers' },
    { text: 'Does he have experience with AWS?', icon: 'cloud' },
    { text: 'What is his notice period?', icon: 'clock' },
    { text: 'What are his strengths?', icon: 'star' },
    { text: 'How can I contact him?', icon: 'mail' },
  ];
}

