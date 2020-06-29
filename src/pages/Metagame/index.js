import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import Events from 'pages/Events';
import Matrix from './Matrix';
import GetStarted from 'pages/GetStarted';
import { useAppContext, useScrollRestore } from 'hooks';

function Metagame() {
  const { events } = useAppContext();
  const eventsData = events && events
    ?.filter(({ closed }) => closed)
    .sort((a, b) => parseInt(b?.time) - parseInt(a?.time));
  if (eventsData) eventsData.length = 5;
  const [visibleSections, setVisibleSections] = useState([]);
  const eventsList = useRef();
  const matrix = useRef();
  const getStarted = useRef();
  useScrollRestore();

  useEffect(() => {
    const revealSections = [eventsList, matrix, getStarted];

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
        title="Metagame - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Metagame"
          title="Recent Events and Top Decks"
        />
        <Events
          alternate
          id="events"
          title="Recent Events"
          events={eventsData}
          sectionRef={eventsList}
          visible={visibleSections.includes(eventsList.current)}
        />
        <Matrix
          id="matrix"
          sectionRef={matrix}
          visible={visibleSections.includes(matrix.current)}
        />
        <GetStarted
          accent
          id="get-started"
          sectionRef={getStarted}
          visible={visibleSections.includes(getStarted.current)}
        />
      </PageLayout>
    </Fragment>
  );
}

export default Metagame;
