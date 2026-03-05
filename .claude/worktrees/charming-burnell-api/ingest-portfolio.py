#!/usr/bin/env python3
"""
Ingest Nihar Ranjan's real resume content into ChromaDB via the RAG API.
Based on NIHAR_RANJAN_.pdf — run once after starting all services.
Usage: python ingest-portfolio.py
"""

import urllib.request
import json

API = "http://localhost:5000/api/ingest/text"

DOCUMENTS = [
    {
        "documentId": "bio",
        "title": "About Nihar Ranjan — Profile & Contact",
        "text": """
Nihar Ranjan is a Senior Software Engineer with 7+ years of experience building enterprise
products for Microsoft-facing platforms. He is based in Redmond, Washington, United States.

Contact: nrmahajan840@gmail.com | Phone: 4252403104
LinkedIn: https://www.linkedin.com/in/nihar-ranjan-5bb54853/
GitHub: https://github.com/nihar840

Profile Summary:
Senior Software Engineer with strong hands-on experience across React/TypeScript, .NET,
Python, and Azure. Currently working on AI-assisted data workflows involving retrieval,
document analysis, step-wise execution, and strict validation to safely generate and write
derived data into enterprise systems. Experienced in taking AI-enabled features from design
to production with a focus on reliability, traceability, and controlled execution.
"""
    },
    {
        "documentId": "skills",
        "title": "Technical Skills",
        "text": """
Nihar Ranjan's core technical skills:

Frontend: React, TypeScript, JavaScript, Redux, enterprise UX patterns, HTML5, CSS3

Backend: .NET, Python, REST APIs, authentication/authorization, validation & schema enforcement

AI & Machine Learning: AI-assisted execution flows, grounded retrieval, RAG (Retrieval-Augmented
Generation), command generation & verification, guardrails, audit trails, LLM integration

Databases: Cosmos DB, SQL Server, NoSQL, Azure Blob Storage

Cloud & DevOps: Azure, Azure DevOps, CI/CD pipelines, GitHub

Observability: Structured logging, diagnostics, metrics/tracing, incident reduction through
practical design

Nihar has strong React and TypeScript skills, building production enterprise UX for Microsoft.
He is very experienced with .NET, Python, Azure, and AI/ML integration in production systems.
"""
    },
    {
        "documentId": "experience-microsoft-cosmic",
        "title": "Software Engineer at Microsoft — Cosmic Portal (via Tech Mahindra / Zen3)",
        "text": """
Nihar Ranjan is currently working as a Software Engineer on the Cosmic Portal at Microsoft,
via Tech Mahindra and Zen3, based in Redmond, Washington. Period: July 2025 to Present.

Key responsibilities and achievements:
- Working on AI-assisted column generation where users define rules in the UI to generate
  derived columns on top of Cosmos DB data.
- Implemented a step-wise execution pipeline to retrieve rows, fetch linked documents,
  extract relevant content, validate outputs, and safely write results back to the database.
- Designed workflows integrating Cosmos DB and Azure Blob Storage to assemble structured
  context for downstream processing.
- Built a command generation and execution layer where outputs are validated against schemas
  and business rules before database updates.
- Implemented guardrails and validation checks including input sanitization, allowed-action
  constraints, confidence checks, and traceability for generated values.
- Contributed to retrieval logic such as document selection, relevance filtering, chunking,
  and context limits.
- Created a reusable Python logging utility for structured logging and diagnostics.
- Built and integrated a React-based experience into enterprise CRM flows.

This role demonstrates deep expertise in AI engineering, RAG systems, Cosmos DB, Azure,
React/TypeScript, Python, and enterprise-scale production systems at Microsoft.
"""
    },
    {
        "documentId": "experience-zen3-microsoft",
        "title": "Software Engineer / Associate Team Lead at Zen3 — Microsoft FastTrack",
        "text": """
Nihar Ranjan worked as a Software Engineer and Associate Team Lead at Zen3, delivering
work for Microsoft's FastTrack Automation and Unified Action Tracker teams.
Period: March 2021 to June 2025.

Key responsibilities and achievements:
- Shipped enterprise-grade automation workflows within Microsoft 365 Admin UX.
- Owned features end-to-end from UI design to production deployment.
- Acted as Associate Team Lead through code reviews and mentoring junior engineers.
- Migrated backend workflows from Logic Apps to Azure Functions for improved scalability.
- Built reusable UI components for data-heavy enterprise applications using React and TypeScript.

This role shows Nihar's experience in Microsoft 365 ecosystem, Azure Functions, React,
TypeScript, team leadership, and full-stack enterprise product delivery over 4 years.
"""
    },
    {
        "documentId": "experience-specialist",
        "title": "Specialist Programmer",
        "text": """
Nihar Ranjan worked as a Specialist Programmer from July 2020 to February 2021.

Key work:
- Delivered critical React UI components under strict timelines for enterprise applications.

This role involved React frontend development with a focus on performance and delivery.
"""
    },
    {
        "documentId": "experience-early",
        "title": "Early Career — Software Engineer (.NET & Healthcare)",
        "text": """
Nihar Ranjan worked as a Software Engineer from July 2018 to June 2020.

Key work:
- Developed .NET MVC and VB.NET features for a healthcare order management system.
- Gained foundational experience in .NET backend development, database integration,
  and enterprise application development in the healthcare domain.
"""
    },
    {
        "documentId": "awards-certifications",
        "title": "Awards, Leadership & Certifications",
        "text": """
Nihar Ranjan's awards, leadership roles, and certifications:

Leadership:
- ASCEND Leadership Program (Tech Mahindra) — 2nd Position Holder
- Tech Mahindra AI Center of Excellence (AI CoE) — Contributor to AI awareness and
  practical adoption initiatives within the organization.
- Associate Team Lead at Zen3/Microsoft — led code reviews and mentored engineers.

Awards:
- ACE Award — Tech Mahindra (recognition for outstanding contribution)

Certifications:
- Microsoft Certified: Azure Fundamentals (AZ-900)
- Infosys Certified Python Programmer

These demonstrate Nihar's commitment to continuous learning, AI/cloud expertise,
and leadership at enterprise organizations.
"""
    },
    {
        "documentId": "education",
        "title": "Education",
        "text": """
Nihar Ranjan's educational background:

Degree: B.Tech — Information Technology
Institution: Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar
CGPA: 7.56

KIIT (Kalinga Institute of Industrial Technology) is a Deemed University in Bhubaneswar,
Odisha, India, known for its strong engineering and technology programs. Nihar graduated
with a B.Tech in Information Technology, which formed the foundation of his career in
software engineering, cloud architecture, and AI development.
"""
    },
    {
        "documentId": "projects-ai-work",
        "title": "AI & RAG Projects — Microsoft and Personal",
        "text": """
Nihar Ranjan has worked on several AI and RAG (Retrieval-Augmented Generation) projects:

1. AI-Assisted Column Generation (Microsoft / Cosmic Portal):
   A production AI system where users define natural language rules to generate derived
   columns on Cosmos DB data. Involves step-wise retrieval, document analysis, validation
   pipelines, guardrails, and audit trails. Built with React, .NET, Python, Cosmos DB, Azure.

2. RAG Portfolio Search (Personal Project):
   A local AI-powered question-and-answer system over portfolio documents. Streams answers
   from a local Ollama LLM, backed by ChromaDB vector store and a .NET RAG orchestration
   layer. Technologies: React, .NET Core, Ollama, ChromaDB, Server-Sent Events (SSE).
   This is the very system you are talking to right now!

3. FastTrack Automation (Microsoft / Zen3):
   Enterprise-grade automation workflows for Microsoft 365 Admin UX. Backend migrated from
   Logic Apps to Azure Functions. Built with React, TypeScript, Azure Functions, .NET.

These projects showcase Nihar's deep expertise in production AI systems, RAG architecture,
React/TypeScript frontend, .NET backend, and Azure cloud deployment.
"""
    },
    {
        "documentId": "location-availability",
        "title": "Location, Availability & Contact",
        "text": """
Nihar Ranjan is currently based in Redmond, Washington, United States.
He is working at Microsoft (via Tech Mahindra / Zen3) on the Cosmic Portal project.

Contact Information:
- Email: nrmahajan840@gmail.com
- Phone: 4252403104
- Location: Redmond, Washington, USA
- LinkedIn: https://www.linkedin.com/in/nihar-ranjan-5bb54853/
- GitHub: https://github.com/nihar840

His resume is available for download at: https://niharranjan.com/resume.pdf
"""
    },
]


def ingest(doc):
    payload = json.dumps({
        "documentId":     doc["documentId"],
        "title":          doc["title"],
        "content":        doc["text"].strip(),
        "collectionName": "portfolio-docs",
        "metadata":       {"source": "resume"},
    }).encode("utf-8")

    req = urllib.request.Request(
        API,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode()
            print(f"  ✅ {doc['documentId']} — {resp.status} {body[:80]}")
    except urllib.error.HTTPError as e:
        print(f"  ❌ {doc['documentId']} — HTTP {e.code}: {e.read().decode()[:200]}")
    except Exception as e:
        print(f"  ❌ {doc['documentId']} — {e}")


if __name__ == "__main__":
    print(f"\n🚀 Ingesting {len(DOCUMENTS)} documents from NIHAR_RANJAN_.pdf...\n")
    for doc in DOCUMENTS:
        print(f"  → {doc['title']}")
        ingest(doc)
    print("\n✨ Done! The AI now knows Nihar's real resume.\n")
