import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import About from 'pages/Home/About';
import GetStarted from 'pages/GetStarted';
import { useScrollRestore } from 'hooks';

function Format() {
  const [visibleSections, setVisibleSections] = useState([]);
  const about = useRef();
  const getStarted = useRef();
  useScrollRestore();

  useEffect(() => {
    const revealSections = [about, getStarted];

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);
          if (visibleSections.includes(section)) return;
          setVisibleSections(prevSections => [...prevSections, section]);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <Fragment>
      <Helmet
        title="Format - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Format"
          title="Format Mission and Metagame"
        />
        <About
          id="about"
          alternate
          sectionRef={about}
          visible={visibleSections.includes(about.current)}
        />
        <GetStarted
          id="get-started"
          sectionRef={getStarted}
          visible={visibleSections.includes(getStarted.current)}
        />
      </PageLayout>
    </Fragment>
  );
}

export default Format;
