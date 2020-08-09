import React, { useMemo, useState, useCallback, useEffect, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NotFound from 'pages/NotFound';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { Label, Title2 } from 'components/Type';
import Input from 'components/Input';
import { Link } from 'components/Link';
import Button from 'components/Button';
import {
  useAppContext, useEventData, usePrevious, useFormInput, useScrollRestore,
  useInterval
} from 'hooks';
import config from 'config';
import './Play.css';

const records = [
  '2-0-0',
  '2-1-0',
  '1-0-1',
  '1-1-1',
  '0-1-0',
  '0-2-0',
  '1-2-0',
  '0-1-1',
];

const Play = ({
  match: { params: { eventID } }
}) => {
  const history = useHistory();
  const { user, dispatch } = useAppContext();
  const { player, events, activeEvent } = useEventData(eventID);
  const { round = 0, rounds = 0 } = activeEvent;
  const prevRound = usePrevious(round);
  const opponent = useMemo(() => player?.opponents ? player.opponents?.pop() : null, [player]);
  const waiting = activeEvent?.round === player?.matches?.filter(Boolean)?.length;
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState(waiting);
  const record = useFormInput('');
  useScrollRestore();

  const handleSignout = useCallback(event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: `/events/play/${eventID}` });
  }, [dispatch, eventID]);

  useEffect(() => {
    if (!player || !activeEvent?.fired) history.push(`/events/${eventID}`);
  }, [player, activeEvent, history, eventID]);

  useEffect(() => {
    if (activeEvent?.fired && !user) {
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

    if (prevRound !== activeEvent?.round) setComplete(false);
  }, 10000, user);

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
          result: `${record.value}`
        }),
      });

      const data = await response.json();
      if (response.status !== 200) throw new Error(data?.error || response.statusText);

      setSubmitting(false);
      setComplete(true);

      window.scrollTo(0, 0);
      document.getElementById('MainContent').focus();
    } catch (error) {
      setSubmitting(false);
      alert(error.message);
    }
  }, [submitting, eventID, user, record.value]);

  return (
    <Fragment>
      {(events && !activeEvent) && <NotFound />}
      {activeEvent &&
        <Fragment>
          <Helmet
            title="Play - Project Modern"
          />
          <PageLayout>
            {complete
              ? (
                  <Hero center>
                    <Label>Round {round}/{rounds}</Label>
                    <Title2>Waiting for next round.</Title2>
                    <div className="play__buttons">
                      <Button as={Link} to={`/events/${eventID}`} className="play__back" label="Back" />
                    </div>
                  </Hero>
                )
              : (
                  <Hero center>
                    <Label>Round {round}/{rounds}</Label>
                    <Title2>Round {round} vs {opponent}</Title2>
                    <div className="play__input">
                      <Input {...record} required as="select">
                        <option>Record (wins-losses-ties)</option>
                        {records.map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </Input>
                    </div>
                    <div className="play__buttons">
                      <Button as={Link} to={`/events/${eventID}`} className="play__back" label="Back" />
                      <Button onClick={onSubmit} className="play__next" label="Confirm" />
                    </div>
                  </Hero>
                )
            }
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
};

export default Play;
