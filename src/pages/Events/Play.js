import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import Button from 'components/Button';
import Input from 'components/Input';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { useAppContext, useFormInput, usePrevious, useScrollRestore, useInterval } from 'hooks';
import config from 'config';
import './Play.css';

function Play(props) {
  const { history, match: { params: { eventID } } } = props;
  const { events, user, dispatch } = useAppContext();
  const activeEvent = events?.length > 0 && events?.filter(({ id }) => id === eventID)[0];
  const isPlaying = activeEvent?.players && activeEvent?.players[user?.id]?.dropped === false;
  const fired = new Date() >= new Date(activeEvent?.time);
  const player = activeEvent?.players && activeEvent?.players[user?.id];
  const opponent = player?.opponents && player?.opponents[player?.opponents?.length - 1];
  const wins = useFormInput('');
  const losses = useFormInput('');
  const ties = useFormInput('');
  const [dropping, setDropping] = useState();
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState(activeEvent?.round === player?.matches?.length);
  const previousRound = usePrevious(activeEvent?.round);
  useScrollRestore();

  const handleSignout = useCallback(event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: `/events/play/${eventID}` });
  }, [dispatch, eventID]);

  useEffect(() => {
    if (!fired) history.push(`/events/${eventID}`);
  }, [fired, history, eventID]);

  useEffect(() => {
    if (activeEvent && !user) {
      handleSignout();
      window.location = config.authURL;
    }
  }, [activeEvent, user, handleSignout]);

  useInterval(() => {
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

    fetchEvents();

    if (previousRound !== activeEvent?.round) setComplete(false);
  }, 10000, user);

  const handleDrop = useCallback(async event => {
    event.preventDefault();
    if (dropping) return;

    try {
      setDropping(true);

      const response = await fetch(`/functions/events/drop/${eventID}/${user.id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'secret': config.secret,
        },
      });

      const data = await response.json();
      if (response.status !== 200) throw new Error(data?.error || response.statusText);

      handleSignout();
      return window.location = config.authURL;
    } catch (error) {
      setDropping(false);
      alert(error.message);
    }
  }, [dropping, eventID, user, handleSignout]);

  const onSubmit = useCallback(async event => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await fetch(`/functions/events/report/${eventID}/${user.id}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'secret': config.secret,
        },
        body: JSON.stringify({
          result: `${wins.value === '' ? 0 : wins.value}-${losses.value === '' ? 0 : losses.value}-${ties.value === '' ? 0 : ties.value}`
        }),
      });

      const data = await response.json();
      if (response.status !== 200) throw new Error(data?.error || response.statusText);

      setComplete(true);
      setSubmitting(false);

      window.scrollTo(0, 0);
      document.getElementById('MainContent').focus();
    } catch (error) {
      setSubmitting(false);
      alert(error.message);
    }
  }, [submitting, eventID, user, wins.value, losses.value, ties.value]);

  return (
    <Fragment>
      {(events && !activeEvent) && <NotFound />}
      {activeEvent &&
        <Fragment>
          <Helmet
            title="Play - Project Modern"
          />
          {(!activeEvent?.closed && !complete) &&
            <PageLayout>
              <Hero
                title2={`Round ${activeEvent?.round || 0}`}
                paragraph={`You've been paired versus ${opponent || 'opponent'}.`}
              >
                <form className="play__form" onSubmit={onSubmit}>
                  <label className="play__form-label">Record your match here.</label>
                  <div className="play__grid play__grid--thirds">
                    <Input {...wins} type="number" min="0" max="2" placeholder="Wins" />
                    <Input {...losses} type="number" min="0" max="2" placeholder="Losses" />
                    <Input {...ties} type="number" min="0" max="2" placeholder="Ties" />
                  </div>
                  <div className="play__grid play__grid--submit">
                    <Button label={isPlaying ? 'Update' : 'Submit'} />
                    {user &&
                      <p className="play__comment">
                        <Anchor secondary={1} as={Link} to={`/events/${eventID}`} onClick={handleDrop}>Drop Event</Anchor>
                      </p>
                    }
                  </div>
                </form>
              </Hero>
            </PageLayout>
          }
          {(!activeEvent?.closed && complete) &&
            <PageLayout>
              <Hero
                title2={activeEvent?.round ? 'Match Recorded' : 'Seeding'}
                paragraph="Waiting on next round's pairings."
              />
            </PageLayout>
          }
          {activeEvent?.closed &&
            <PageLayout>
              <Hero
                title2="Thanks for Playing"
                paragraph="This event has closed."
                button={{ to: `/events/${eventID}`, label: 'Continue' }}
              />
            </PageLayout>
          }
        </Fragment>
      }
    </Fragment>
  );
}

export default Play;
