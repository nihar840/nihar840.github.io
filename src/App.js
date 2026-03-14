import React from 'react';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import ScanLine from './components/HUD/ScanLine';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Skills from './components/Skills/Skills';
import Experience from './components/Experience/Experience';
import Projects from './components/Projects/Projects';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import SmileyBuddy from './components/SmileyBuddy/SmileyBuddy';

function App() {
  return (
    <ThemeProvider>
      <ParticleBackground />
      <ScanLine />
      <Header />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <SmileyBuddy />
    </ThemeProvider>
  );
}

export default App;
