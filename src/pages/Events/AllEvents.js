import React, { useState, useEffect, useRef, Fragment, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import Events from '.';
import GetStarted from 'pages/GetStarted';
import { useAppContext, useScrollRestore } from 'hooks';

function AllEvents() {
  const { events } = useAppContext();;
  const [visibleSections, setVisibleSections] = useState([]);
  const eventsList = useRef();
  const getStarted = useRef();
  useScrollRestore();

  useEffect(() => {
    const revealSections = [eventsList, getStarted];

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
        title="Events - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Events"
          title="Level up your skills with daily tournaments"
        />
        <Events
          alternate
          id="events"
          title="Active Events"
          events={events}
          sectionRef={eventsList}
          visible={visibleSections.includes(eventsList.current)}
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

export default memo(AllEvents);
