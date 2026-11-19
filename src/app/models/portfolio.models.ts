// Portfolio data models

export interface Profile {
  name: string;
  fullName: string;
  currentCompany: string;
  currentRole: string;
  primarySpecialization: string;
  designation: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  location: string;
  experienceYears: string;
  joiningDate: string;
  client: string;
  project: string;
  noticePeriod: string;
  availability: string;
  education: Education;
  summary: string;
  lastUpdated: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
}

export interface Skill {
  name: string;
  items: string[];
  level: 'professional' | 'learning' | 'basic';
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export interface Experience {
  role: string;
  company: string;
  client: string;
  project: string;
  duration: string;
  location: string;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface Project {
  title: string;
  type: 'professional' | 'personal';
  company?: string;
  client?: string;
  duration: string;
  role: string;
  description: string;
  businessContext: string;
  technologies: string[];
  responsibilities: string[];
  challenges: { challenge: string; solution: string }[];
  outcomes: string[];
  featured?: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  status: 'completed' | 'in-progress';
  date?: string;
  credentialUrl?: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
  isLoading?: boolean;
  isError?: boolean;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  error?: string;
}

export interface SuggestedQuestion {
  text: string;
  icon: string;
}

