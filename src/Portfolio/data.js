export const profile = {
  name: 'Nihar Ranjan',
  title: 'Full Stack Engineer',
  tagline: 'Building scalable systems at the intersection of cloud, AI, and great UX',
  email: 'niharranjan.mahajan420@gmail.com',
  location: 'India',
  social: {
    twitter: 'https://twitter.com/NiharMahajan',
    facebook: 'https://www.facebook.com/niharranjan.mahajan420',
    linkedin: 'https://www.linkedin.com/in/nihar-ranjan-5bb54853/',
    instagram: 'https://www.instagram.com/n_i_h_a_r___/',
    github: 'https://github.com/nihar840',
  },
};

export const skills = [
  {
    category: 'Languages',
    icon: '⌨️',
    items: ['TypeScript', 'C#', 'Python', 'Java', 'JavaScript', 'SQL'],
  },
  {
    category: 'Frontend',
    icon: '🎨',
    items: ['React', 'Angular', 'Redux', 'HTML5', 'CSS3 / SCSS', 'Webpack'],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    items: ['ASP.NET Core', 'Node.js', 'FastAPI', 'Spring Boot', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'Cloud & DevOps',
    icon: '☁️',
    items: ['Azure', 'AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'CI/CD'],
  },
  {
    category: 'Databases',
    icon: '🗄️',
    items: ['PostgreSQL', 'SQL Server', 'MongoDB', 'Redis', 'ChromaDB'],
  },
  {
    category: 'AI / ML',
    icon: '🧠',
    items: ['PyTorch', 'scikit-learn', 'LLM / RAG', 'Pandas', 'NumPy', 'Ollama'],
  },
];

export const experience = [
  {
    role: 'Senior Software Engineer',
    company: 'Infosys',
    period: '2021 – Present',
    location: 'Bangalore, India',
    color: '#6366f1',
    highlights: [
      'Architected .NET Core microservices platform handling 2M+ requests / day with 99.9% uptime',
      'Led React migration from Angular, cutting initial load time by 40% and halving bundle size',
      'Designed ML pipeline for customer churn prediction achieving 89% accuracy (PyTorch + Azure ML)',
      'Mentored team of 6 engineers, introduced code review standards and automated testing culture',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Wipro',
    period: '2019 – 2021',
    location: 'Hyderabad, India',
    color: '#06b6d4',
    highlights: [
      'Built REST APIs in Java Spring Boot serving B2B clients across 12 countries',
      'Reduced CI/CD pipeline time by 60% by Dockerising monolith into containerised services',
      'Implemented real-time dashboards using WebSockets + React, replacing slow polling solution',
      'Optimised PostgreSQL queries, reducing average response time from 800 ms to 90 ms',
    ],
  },
  {
    role: 'Junior Developer',
    company: 'Tata Consultancy Services',
    period: '2017 – 2019',
    location: 'Pune, India',
    color: '#10b981',
    highlights: [
      'Developed internal HR automation tools with React and Node.js used by 5,000+ employees',
      'Maintained and migrated SQL Server databases holding 500K+ records with zero downtime',
      'Contributed to Agile sprints, consistently delivering features ahead of schedule',
    ],
  },
];

export const education = [
  {
    degree: 'B.Tech — Computer Science & Engineering',
    institution: 'NIT Rourkela',
    period: '2013 – 2017',
    gpa: '8.4 / 10',
  },
];

export const projects = [
  {
    title: 'RAG Portfolio Search',
    emoji: '🤖',
    description:
      'Local AI-powered Q&A over portfolio documents. Streaming answers from Ollama LLM backed by ChromaDB vector store and a .NET RAG orchestration layer.',
    tags: ['React', '.NET', 'Ollama', 'ChromaDB', 'SSE'],
    color: '#6366f1',
    link: null,
  },
  {
    title: 'Customer Churn Predictor',
    emoji: '📊',
    description:
      'End-to-end ML pipeline that predicts subscription churn with 89% accuracy. Features automated retraining, SHAP explainability, and a FastAPI inference endpoint.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'Azure ML', 'SHAP'],
    color: '#06b6d4',
    link: null,
  },
  {
    title: 'Microservices Platform',
    emoji: '⚡',
    description:
      'Distributed .NET Core backend serving 2M+ daily requests. Implements CQRS, event sourcing, distributed tracing with OpenTelemetry, and auto-scaling on Kubernetes.',
    tags: ['.NET Core', 'Kubernetes', 'Docker', 'CQRS', 'Azure'],
    color: '#10b981',
    link: null,
  },
  {
    title: 'Real-time Analytics Dashboard',
    emoji: '📈',
    description:
      'Live WebSocket-powered dashboard replacing a polling-based system. Reduced server load by 70% while delivering sub-100ms data freshness for business KPIs.',
    tags: ['React', 'WebSockets', 'Node.js', 'PostgreSQL', 'Redis'],
    color: '#f59e0b',
    link: null,
  },
];
