import React from 'react';
import TwoPaneLayout from '../layouts/TwoPaneLayout';
import { Header } from '../components/Header';
import { Links } from '../components/Links';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { Education } from '../components/Education';
import { Skills } from '../components/Skills';
import { Footer } from '../components/Footer';
import { DATA } from '../data';
import './HomePage.css';

const HomePage = () => {
  const leftPane = (
    <>
      <Header data={DATA} />
      <Links data={DATA} />
    </>
  );

  const rightPane = (
    <>
      <About data={DATA} />
      <Projects data={DATA} />
      <Experience data={DATA} />
      <Education data={DATA} />
      <Skills data={DATA} />
    </>
  );

  return (
    <div className="home-page">
      <TwoPaneLayout left={leftPane} right={rightPane} />
      <Footer data={DATA} />
    </div>
  );
};

export default HomePage;
