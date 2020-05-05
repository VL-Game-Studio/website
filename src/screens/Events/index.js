import React, { useState, useEffect, Fragment } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import RegistrationForm from './RegistrationForm';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

export default function Events(props) {
  const history = useHistory();
  const { pathname } = useLocation();
  const path = pathname.includes('/events/') && pathname.split('/events/')[1];
  const id = path && path.includes('/') ? path.replace('/', '') : path;
  const [league, setLeague] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/functions/leagues/${id}`, {
          method: 'GET',
          mode: 'cors',
        });

        const data = await response.json();

        if (response.status === 404) return history.push('/#events');
        if (response.status !== 200) throw new Error(data.error);

        return data && setLeague(data);
      } catch (error) {
        console.error(error.message);
        return alert(error.message);
      }
    }

    if (!prerender) fetchEvent();
  }, [id, history]);

  return (
    <Fragment>
      {league &&
        <Transition
          appear
          timeout={0}
          onEnter={reflow}
        >
          {status => (
            <RegistrationForm status={status} league={league} />
          )}
        </Transition>
      }
    </Fragment>
  );
}
