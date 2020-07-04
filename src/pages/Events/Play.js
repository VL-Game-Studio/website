import React, { useState, useEffect, useCallback, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import Button from 'components/Button';
import Input from 'components/Input';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { media } from 'utils/style';
import { useAppContext, useFormInput, usePrevious, useScrollRestore, useInterval } from 'hooks';
import config from 'config';

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
                <Form onSubmit={onSubmit}>
                  <FormLabel>Record your match here.</FormLabel>
                  <ThirdsGrid>
                    <Input {...wins} type="number" min="0" max="2" placeholder="Wins" />
                    <Input {...losses} type="number" min="0" max="2" placeholder="Losses" />
                    <Input {...ties} type="number" min="0" max="2" placeholder="Ties" />
                  </ThirdsGrid>
                  <SubmitGrid>
                    <Button label={isPlaying ? 'Update' : 'Submit'} />
                    {user &&
                      <Comment><Anchor secondary={1} as={Link} to={`/events/${eventID}`} onClick={handleDrop}>Drop Event</Anchor></Comment>
                    }
                  </SubmitGrid>
                </Form>
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

const Form = styled.form`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 100px;

  @media (max-width: ${media.mobile}px) {
    margin-top: var(--space2XL);
    width: 100%;
  }
`;

const HalvedGrid = styled.div`
  display: grid;
  grid-gap: var(--spaceXL);
  grid-template-columns: 1fr 1fr;
  width: 100%;

  @media (max-width: ${media.mobile}px) {
    grid-template-columns: 1fr;
    width: 100%;
  }
`;

const ThirdsGrid = styled(HalvedGrid)`
  grid-template-columns: 1fr 1fr 1fr;
  width: 50%;
`;

const FormLabel = styled.label`
  color: ${props => props.theme.colorTitle};
  font-size: 1.375rem;
  font-weight: var(--fontWeightMedium);
  letter-spacing: 0.02em;
  line-height: 1.6;
  margin: var(--space2XL) 0 var(--spaceL);
`;

const SubmitGrid = styled(HalvedGrid)`
  grid-template-columns: var(--space7XL) auto;
  margin-top: var(--space2XL);

  @media (max-width: ${media.mobile}px) {
    margin-top: var(--spaceXL);
    display: block;
  }
`;

const Comment = styled.p`
  &, a {
    color: var(--colorTextBody);
    font-size: var(--fontSizeH3);
    letter-spacing: 0.05em;
    line-height: 3;

    @media (max-width: ${media.mobile}px) {
      margin-top: var(--spaceL);
    }
  }
`;

export default Play;
