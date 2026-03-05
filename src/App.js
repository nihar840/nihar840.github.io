/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState } from 'react';
import './App.css';
import Header from './Header/Header';
import SearchPage from './Search/SearchPage';
import Hero from './Portfolio/Hero';
import Skills from './Portfolio/Skills';
import Experience from './Portfolio/Experience';
import Projects from './Portfolio/Projects';
import Contact from './Portfolio/Contact';

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = () => setSearchOpen(true);

  return (
    <React.Fragment>
      <Header onSearchOpen={openSearch} />
      <main>
        <Hero onSearchOpen={openSearch} />
        <Skills />
        <Experience />
        <Projects />
        <Contact onSearchOpen={openSearch} />
      </main>
      {searchOpen && <SearchPage onClose={() => setSearchOpen(false)} />}
    </React.Fragment>
  );
}

export default App;
