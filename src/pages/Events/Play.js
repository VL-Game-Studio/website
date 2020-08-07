import React, { useCallback, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import NotFound from 'pages/NotFound';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { Label, Title2 } from 'components/Type';
import Input from 'components/Input';
import Button from 'components/Button';
import { useAppContext, useEventData, usePrevious, useScrollRestore } from 'hooks';
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
  history,
  match: { params: { eventID } }
}) => {
  const { user, dispatch } = useAppContext();
  const { player, events, activeEvent } = useEventData(eventID);
  const { round = 0, rounds = 0 } = activeEvent;
  const prevRound = usePrevious(round);
  const opponent = player?.opponents ? player?.opponents?.pop() : null;
  const waiting = round === 0 || prevRound !== round;
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

  return (
    <Fragment>
      {(events && !activeEvent) && <NotFound />}
      {activeEvent &&
        <Fragment>
          <Helmet
            title="Play - Project Modern"
          />
          <PageLayout>
            {waiting
              ? (
                  <Hero center>
                    <Label>Round {round}/{rounds}</Label>
                    <Title2>Waiting for next round.</Title2>
                    <div className="play__buttons">
                      <Button className="play__back" label="Back" />
                      <Button disabled className="play__next" label="Next" />
                    </div>
                  </Hero>
                )
              : (
                  <Hero center>
                    <Label>Round {round}/{rounds}</Label>
                    <Title2>Round {round} vs {opponent}</Title2>
                    <div className="play__input">
                      <Input as="select">
                        <option>Record (wins-losses-ties)</option>
                        {records.map(val => (
                          <option value={val}>{val}</option>
                        ))}
                      </Input>
                    </div>
                    <div className="play__buttons">
                      <Button className="play__back" label="Back" />
                      <Button className="play__next" label="Next" />
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
