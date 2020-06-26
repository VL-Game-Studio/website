import React, { lazy, useEffect, useState, useRef, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import GetStarted from 'pages/GetStarted';
import Panel from './Panel';
import { useAppContext, useScrollRestore } from 'hooks';
import prerender from 'utils/prerender';

const Create = lazy(() => import('./Create'));
const Signup = lazy(() => import('./Signup'));
const Info = lazy(() => import('./Info'));
const NotFound = lazy(() => import('pages/NotFound'));

function Events(props) {
  const { id, sectionRef, visible, ...rest } = props;
  const titleId = `${id}-title`;
  const { dispatch, events } = useAppContext();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/functions/events', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) return false;

        const data = await response.json();

        return dispatch({
          type: 'setEvents',
          value: Object.values(data),
        });
      } catch (error) {
        dispatch({ type: 'setEvents', value: false });
        return console.error(error.message);
      }
    }

    if (!prerender) fetchEvents();
  }, [dispatch]);

  if (!sectionRef) return (
    <Suspense fallback={<Fragment />}>
      <Switch>
        <Route exact path="/events" component={EventsList} />
        <Route path="/events/create" component={Create} />
        <Route path="/events/signup/:eventID" component={Signup} />
        <Route path="/events/:eventID" component={Info} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );

  return (
    <Panel
      id={id}
      titleId={titleId}
      sectionRef={sectionRef}
      visible={visible}
      events={events && events?.filter(({ fired }) => !fired)}
      {...rest}
    />
  );
}

function EventsList() {
  const { events } = useAppContext();
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
          events={events && events?.filter(({ fired }) => !fired)}
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

export default Events;
