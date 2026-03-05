#!/usr/bin/env python3
"""
0. Drop the entire ChromaDB collection (so it gets re-created with cosine metric)
1. Delete all old / wrong document IDs from ChromaDB
2. Re-ingest correct data from real resume
"""
import urllib.request
import json

API_BASE   = "http://localhost:5000/api"
CHROMA_BASE = "http://localhost:8000/api/v1"
COLLECTION  = "portfolio-docs"

# ── Old wrong IDs to delete ───────────────────────────────────────────────
OLD_IDS = [
    "experience-infosys",
    "experience-wipro",
    "experience-tcs",
    "project-churn",
    "project-microservices",
    "project-dashboard",
    "project-rag-search",   # will be re-added with corrected copy
    "bio",
    "skills",
    "education",
]

# ── Correct documents from NIHAR_RANJAN_.pdf ─────────────────────────────
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
Generation), command generation & verification, guardrails, audit trails, LLM integration, Ollama

Databases: Cosmos DB, SQL Server, NoSQL, Azure Blob Storage, ChromaDB

Cloud & DevOps: Azure, Azure DevOps, CI/CD pipelines, GitHub, Azure Functions, Azure Blob Storage

Observability: Structured logging, diagnostics, metrics/tracing, incident reduction

Nihar has strong React and TypeScript skills, building production enterprise UX for Microsoft.
He is very experienced with .NET, Python, Azure, and AI/ML integration in production systems.
He does NOT work at Infosys, Wipro, or TCS. He works at Microsoft via Tech Mahindra and Zen3.
"""
    },
    {
        "documentId": "experience-microsoft-cosmic",
        "title": "Software Engineer at Microsoft — Cosmic Portal (via Tech Mahindra / Zen3)",
        "text": """
Nihar Ranjan is currently working as a Software Engineer on the Cosmic Portal at Microsoft,
via Tech Mahindra and Zen3, based in Redmond, Washington, USA. Period: July 2025 to Present.

Key responsibilities:
- Working on AI-assisted column generation where users define rules in the UI to generate
  derived columns on top of Cosmos DB data.
- Implemented a step-wise execution pipeline to retrieve rows, fetch linked documents,
  extract relevant content, validate outputs, and safely write results back to the database.
- Designed workflows integrating Cosmos DB and Azure Blob Storage to assemble structured
  context for downstream processing.
- Built a command generation and execution layer with guardrails, input sanitization,
  allowed-action constraints, confidence checks, and full audit traceability.
- Contributed to retrieval logic: document selection, relevance filtering, chunking, context limits.
- Created a reusable Python logging utility for structured logging and diagnostics.
- Built and integrated a React-based experience into enterprise CRM flows.
"""
    },
    {
        "documentId": "experience-zen3-microsoft",
        "title": "Software Engineer / Associate Team Lead at Zen3 — Microsoft FastTrack",
        "text": """
Nihar Ranjan worked as a Software Engineer and Associate Team Lead at Zen3, delivering
work for Microsoft's FastTrack Automation and Unified Action Tracker teams.
Period: March 2021 to June 2025. Location: Redmond, Washington, USA.

Key responsibilities:
- Shipped enterprise-grade automation workflows within Microsoft 365 Admin UX.
- Owned features end-to-end from UI design to production deployment.
- Acted as Associate Team Lead through code reviews and mentoring junior engineers.
- Migrated backend workflows from Logic Apps to Azure Functions.
- Built reusable React/TypeScript UI components for data-heavy enterprise applications.
"""
    },
    {
        "documentId": "experience-specialist",
        "title": "Specialist Programmer at Infosys Ltd. — British Petroleum (BP RIO)",
        "text": """
Nihar Ranjan worked as a Specialist Programmer at Infosys Ltd. from July 2020 to February 2021,
deployed to the British Petroleum (BP RIO) account. Location: India.

Key responsibilities:
- Delivered critical UI components and reusable React modules under strict timelines and
  quality expectations for BP RIO.
- Maintained low defect rates through clean implementation and disciplined delivery practices.
"""
    },
    {
        "documentId": "experience-early",
        "title": "Software Engineer at Infosys Ltd. — Walmart (Order Creation, Healthcare)",
        "text": """
Nihar Ranjan worked as a Software Engineer at Infosys Ltd. from July 2018 to June 2020,
deployed to the Walmart account (Order Creation — healthcare division). Location: India.

Key responsibilities:
- Developed and maintained .NET MVC and VB.NET features for a healthcare order management
  system for Walmart.
- Implemented prescription validation rules and supported urgent production updates during
  COVID-19.

Note: Nihar's employers have been: Microsoft (via Tech Mahindra / Zen3), Tech Mahindra,
Zen3, and Infosys Ltd. He has NOT worked at Wipro or Tata Consultancy Services (TCS).
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
  practical adoption initiatives.
- Associate Team Lead at Zen3/Microsoft — led code reviews and mentored engineers.

Awards:
- ACE Award — Tech Mahindra (recognition for outstanding contribution)

Certifications:
- Microsoft Certified: Azure Fundamentals (AZ-900)
- Infosys Certified Python Programmer
"""
    },
    {
        "documentId": "education",
        "title": "Education — KIIT Bhubaneswar",
        "text": """
Nihar Ranjan's educational background:

Degree: B.Tech — Information Technology
Institution: Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar, India
CGPA: 7.56

Note: Nihar studied at KIIT (Kalinga Institute of Industrial Technology), NOT NIT Rourkela.
His degree is in Information Technology, not Computer Science & Engineering.
His CGPA is 7.56, not 8.4.
"""
    },
    {
        "documentId": "projects-microsoft",
        "title": "Projects — Microsoft AI Column Generation & FastTrack Automation",
        "text": """
Nihar Ranjan's key professional projects at Microsoft:

1. AI Column Generation Pipeline (Microsoft / Cosmic Portal, 2025–Present):
   Users define natural language rules to generate derived columns over Cosmos DB data.
   Step-wise retrieval, document analysis, validation, guardrails, and audit trails.
   Built with React, .NET, Python, Cosmos DB, Azure Blob Storage.

2. FastTrack Automation — Microsoft 365 (Zen3, 2021–2025):
   Enterprise-grade automation workflows within the Microsoft 365 Admin UX.
   Backend migrated from Logic Apps to Azure Functions.
   Built reusable React/TypeScript components for data-heavy enterprise apps.
"""
    },
    {
        "documentId": "project-rag-search",
        "title": "Project — RAG Portfolio Search (Personal)",
        "text": """
RAG Portfolio Search is Nihar Ranjan's personal AI project.

Description: A local AI-powered question-and-answer system over portfolio documents.
Streams real-time answers from a local Ollama LLM backed by ChromaDB vector store
and a .NET RAG orchestration layer using Server-Sent Events (SSE).

Technologies: React, .NET Core, Ollama, ChromaDB, Server-Sent Events

You are currently talking to this very system!
"""
    },
    {
        "documentId": "location-contact",
        "title": "Location & Contact Information",
        "text": """
Nihar Ranjan is currently based in Redmond, Washington, United States.
He works at Microsoft (via Tech Mahindra / Zen3) on the Cosmic Portal project.

Contact:
- Email: nrmahajan840@gmail.com
- Phone: 4252403104
- LinkedIn: https://www.linkedin.com/in/nihar-ranjan-5bb54853/
- GitHub: https://github.com/nihar840
- Resume: https://niharranjan.com/resume.pdf
"""
    },
]


def delete_doc(doc_id):
    req = urllib.request.Request(
        f"{API_BASE}/ingest/{doc_id}",
        method="DELETE",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  🗑  deleted {doc_id} — {resp.status}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"  ⚪ {doc_id} not found (already clean)")
        else:
            print(f"  ⚠  {doc_id} — HTTP {e.code}")
    except Exception as e:
        print(f"  ⚠  {doc_id} — {e}")


def ingest(doc):
    payload = json.dumps({
        "documentId":     doc["documentId"],
        "title":          doc["title"],
        "content":        doc["text"].strip(),
        "collectionName": "portfolio-docs",
        "metadata":       {"source": "resume"},
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{API_BASE}/ingest/text",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"  ✅ {doc['documentId']} — {resp.status}")
    except urllib.error.HTTPError as e:
        print(f"  ❌ {doc['documentId']} — HTTP {e.code}: {e.read().decode()[:120]}")
    except Exception as e:
        print(f"  ❌ {doc['documentId']} — {e}")


def drop_collection():
    """Delete the entire ChromaDB collection so it is re-created with cosine metric."""
    req = urllib.request.Request(
        f"{CHROMA_BASE}/collections/{COLLECTION}",
        method="DELETE",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print(f"  🗑  Dropped collection '{COLLECTION}' — {resp.status}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(f"  ⚪ Collection '{COLLECTION}' didn't exist — nothing to drop")
        else:
            print(f"  ⚠  Drop failed — HTTP {e.code}: {e.read().decode()[:120]}")
    except Exception as e:
        print(f"  ⚠  Drop failed — {e}")


if __name__ == "__main__":
    print("\n💥  Step 0 — Dropping old collection (so it re-creates with cosine metric)...\n")
    drop_collection()

    print("\n🗑  Step 1 — (Old IDs now gone with collection — skipping individual deletes)\n")

    print(f"\n🚀  Step 2 — Ingesting {len(DOCUMENTS)} correct documents...\n")
    for doc in DOCUMENTS:
        print(f"  → {doc['title']}")
        ingest(doc)

    print("\n✨  Done! ChromaDB collection re-created with cosine metric and real resume data.\n")

    print("\n✨  Done! ChromaDB now has accurate resume data.\n")
