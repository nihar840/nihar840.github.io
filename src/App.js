import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const projects = useMemo(() => ([
    {
      title: 'Intelligent Commerce Dashboard',
      description: 'Data-rich analytics experience with live KPIs, modular widgets, and role-based personalization.',
      tags: ['React', 'TypeScript', 'Design Systems']
    },
    {
      title: 'Workflow Automation Studio',
      description: 'Visual flow builder for enterprise operations with resilient execution states and real-time logs.',
      tags: ['Node.js', 'UI Architecture', 'Performance']
    },
    {
      title: 'Customer Insights Platform',
      description: 'Unified journey observability layer turning product signals into actionable business stories.',
      tags: ['Visualization', 'Product Thinking', 'UX']
    }
  ]), []);

  const skills = useMemo(() => ([
    'Frontend Engineering',
    'System Design',
    'UI/UX Strategy',
    'React Ecosystem',
    'Performance Optimization',
    'Team Leadership'
  ]), []);

  useEffect(() => {
    const updateProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <div className="brand">NR</div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="topbar-line" style={{ width: `${scrollProgress}%` }} />
      </header>

      <main>
        <section id="home" className="hero reveal">
          <div className="hero-copy">
            <p className="eyebrow">Associate Team Lead • Frontend Architect</p>
            <h1>
              Nihar Ranjan
              <span>Building digital products that feel futuristic and effortless.</span>
            </h1>
            <p className="intro">
              I craft high-impact web experiences with strong engineering foundations, product intuition,
              and motion-driven UI storytelling.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn primary">Explore Work</a>
              <a href="#contact" className="btn ghost">Let&apos;s Connect</a>
            </div>
          </div>
          <div className="hero-card">
            <img className="profilePic" src="/Images/ProfilePic.jpg" alt="Nihar Ranjan" />
            <div className="status-pill">
              <span className="dot" /> Available for exciting product collaborations
            </div>
          </div>
        </section>

        <section id="about" className="section reveal">
          <h2>About</h2>
          <p>
            I specialize in translating complex business needs into elegant interfaces. My focus is on scalable
            frontend architecture, delightful interactions, and shipping experiences that users instantly trust.
          </p>
        </section>

        <section id="skills" className="section reveal">
          <h2>Core Strengths</h2>
          <div className="skill-grid">
            {skills.map((skill) => (
              <article className="skill-card" key={skill}>{skill}</article>
            ))}
          </div>
        </section>

        <section id="projects" className="section reveal">
          <h2>Featured Projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section reveal">
          <h2>Let&apos;s Build Something Remarkable</h2>
          <p>Open to leadership roles, strategic product collaborations, and ambitious web initiatives.</p>
          <div className="socials">
            <a href="https://twitter.com/nihar______" className="fa fa-twitter" aria-label="Twitter" />
            <a href="https://www.linkedin.com/in/nihar-ranjan-5bb54853/" className="fa fa-linkedin" aria-label="LinkedIn" />
            <a href="https://www.instagram.com/n_i_h_a_r_m_a_h_a_j_a_n" className="fa fa-instagram" aria-label="Instagram" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
