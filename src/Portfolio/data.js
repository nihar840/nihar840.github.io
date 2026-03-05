export const profile = {
  name: 'Nihar Ranjan',
  title: 'Senior Software Engineer',
  tagline: 'Building enterprise AI systems at the intersection of cloud, retrieval, and great UX',
  email: 'nrmahajan840@gmail.com',
  location: 'Redmond, Washington, USA',
  social: {
    twitter:   'https://twitter.com/NiharMahajan',
    facebook:  'https://www.facebook.com/niharranjan.mahajan420',
    linkedin:  'https://www.linkedin.com/in/nihar-ranjan-5bb54853/',
    instagram: 'https://www.instagram.com/n_i_h_a_r___/',
    github:    'https://github.com/nihar840',
  },
};

export const skills = [
  {
    category: 'Frontend',
    icon: '🎨',
    items: ['React', 'TypeScript', 'JavaScript', 'Redux', 'HTML5', 'CSS3'],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    items: ['.NET', 'Python', 'REST APIs', 'Auth / AuthZ', 'Schema Validation', 'VB.NET'],
  },
  {
    category: 'AI & RAG',
    icon: '🧠',
    items: ['Grounded Retrieval', 'RAG Pipelines', 'AI Execution Flows', 'Guardrails', 'Audit Trails', 'Ollama'],
  },
  {
    category: 'Cloud & DevOps',
    icon: '☁️',
    items: ['Azure', 'Azure DevOps', 'Azure Functions', 'CI/CD', 'GitHub', 'Azure Blob Storage'],
  },
  {
    category: 'Databases',
    icon: '🗄️',
    items: ['Cosmos DB', 'SQL Server', 'NoSQL', 'ChromaDB'],
  },
  {
    category: 'Observability',
    icon: '📡',
    items: ['Structured Logging', 'Diagnostics', 'Metrics / Tracing', 'Incident Reduction'],
  },
];

export const experience = [
  {
    role: 'Software Engineer — Cosmic Portal',
    company: 'Microsoft (via Tech Mahindra / Zen3)',
    period: 'Jul 2025 – Present',
    location: 'Redmond, Washington, USA',
    color: '#6366f1',
    highlights: [
      'Working on AI-assisted column generation — users define rules in the UI to generate derived columns on top of Cosmos DB data',
      'Implemented a step-wise execution pipeline to retrieve rows, fetch linked documents, extract relevant content, validate outputs, and safely write results back to the database',
      'Designed workflows integrating Cosmos DB and Azure Blob Storage to assemble structured context for downstream AI processing',
      'Built command generation and execution layer with guardrails, input sanitization, allowed-action constraints, confidence checks, and full audit traceability',
      'Contributed to retrieval logic: document selection, relevance filtering, chunking, and context limits',
      'Created a reusable Python logging utility for structured logging and diagnostics across the service',
      'Built and integrated a React-based experience into enterprise CRM flows',
    ],
  },
  {
    role: 'Software Engineer / Associate Team Lead',
    company: 'Zen3 — Microsoft (FastTrack & Unified Action Tracker)',
    period: 'Mar 2021 – Jun 2025',
    location: 'Redmond, Washington, USA',
    color: '#8b5cf6',
    highlights: [
      'Shipped enterprise-grade automation workflows within Microsoft 365 Admin UX, end-to-end from UI to production',
      'Acted as Associate Team Lead — led code reviews and mentored engineers across the team',
      'Migrated backend workflows from Logic Apps to Azure Functions for improved scalability and cost efficiency',
      'Built reusable React / TypeScript UI components for data-heavy enterprise applications',
    ],
  },
  {
    role: 'Specialist Programmer',
    company: 'Tech Mahindra',
    period: 'Jul 2020 – Feb 2021',
    location: 'India',
    color: '#06b6d4',
    highlights: [
      'Delivered critical React UI components under strict timelines for enterprise client projects',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Tech Mahindra',
    period: 'Jul 2018 – Jun 2020',
    location: 'India',
    color: '#10b981',
    highlights: [
      'Developed .NET MVC and VB.NET features for a healthcare order management system',
      'Gained deep foundational experience in .NET backend development and enterprise database integration',
    ],
  },
];

export const education = [
  {
    degree: 'B.Tech — Information Technology',
    institution: 'KIIT (Kalinga Institute of Industrial Technology), Bhubaneswar',
    period: '2014 – 2018',
    gpa: '7.56 / 10',
  },
];

export const awards = [
  { title: 'ASCEND Leadership Program', org: 'Tech Mahindra', detail: '2nd Position Holder' },
  { title: 'ACE Award', org: 'Tech Mahindra', detail: 'Outstanding contribution recognition' },
  { title: 'AI CoE Contributor', org: 'Tech Mahindra', detail: 'Internal AI awareness & adoption initiatives' },
  { title: 'Microsoft Certified: Azure Fundamentals', org: 'Microsoft', detail: 'AZ-900' },
  { title: 'Certified Python Programmer', org: 'Infosys', detail: '' },
];

export const projects = [
  {
    title: 'AI Column Generation Pipeline',
    emoji: '🤖',
    description:
      'Production AI system at Microsoft where users define natural language rules to generate derived columns over Cosmos DB data. Step-wise retrieval, schema validation, guardrails, and full audit trail.',
    tags: ['React', '.NET', 'Python', 'Cosmos DB', 'Azure'],
    color: '#6366f1',
    link: null,
  },
  {
    title: 'RAG Portfolio Search',
    emoji: '✦',
    description:
      'Local AI-powered Q&A over portfolio documents. Streams answers from a local Ollama LLM backed by ChromaDB vector store and a .NET RAG orchestration layer with SSE.',
    tags: ['React', '.NET', 'Ollama', 'ChromaDB', 'SSE'],
    color: '#8b5cf6',
    link: null,
  },
  {
    title: 'FastTrack Automation — Microsoft 365',
    emoji: '⚡',
    description:
      'Enterprise-grade automation workflows within Microsoft 365 Admin UX. Migrated backend from Logic Apps to Azure Functions and built reusable React/TypeScript component library.',
    tags: ['React', 'TypeScript', '.NET', 'Azure Functions', 'M365'],
    color: '#06b6d4',
    link: null,
  },
  {
    title: 'Healthcare Order Management System',
    emoji: '🏥',
    description:
      'Developed .NET MVC and VB.NET features for a healthcare order management platform. Focus on reliability, data integrity, and enterprise-grade backend architecture.',
    tags: ['.NET MVC', 'VB.NET', 'SQL Server', 'C#'],
    color: '#10b981',
    link: null,
  },
];
