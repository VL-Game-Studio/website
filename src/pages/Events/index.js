import React, { lazy, useEffect, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import EventsPanel from './EventsPanel';
import { useAppContext } from 'hooks';
import prerender from 'utils/prerender';

const AllEvents = lazy(() => import('./AllEvents'));
const EventSignup = lazy(() => import('./EventSignup'));
const EventInfo = lazy(() => import('./EventInfo'));
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
        <Route exact path="/events" component={AllEvents} />
        <Route path="/events/signup/:eventID" component={EventSignup} />
        <Route path="/events/:eventID" component={EventInfo} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );

  return (
    <EventsPanel
      id={id}
      titleId={titleId}
      sectionRef={sectionRef}
      visible={visible}
      events={events?.filter(({ fired }) => !fired)}
      {...rest}
    />
  );
}

export default Events;
