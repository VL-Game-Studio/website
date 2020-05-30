import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import Events from 'pages/Events';
import GetStarted from 'pages/GetStarted';
import { useScrollRestore } from 'hooks';
import prerender from 'utils/prerender';

function Metagame() {
  const [visibleSections, setVisibleSections] = useState([]);
  const eventsList = useRef();
  const getStarted = useRef();
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/functions/events', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) return false;

        const data = await response.json();

        return setEvents(Object.values(data).filter(({ fired }) => fired));
      } catch (error) {
        return console.error(error.message);
      }
    }

    if (!prerender) fetchEvents();
  }, []);

  return (
    <Fragment>
      <Helmet
        title="Metagame - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Metagame"
          title="Recent Events and Metagame"
        />
        <Events
          alternate
          id="events"
          title="Recent Events"
          altText="There aren't any recent events right now."
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

export default Metagame;
