import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import Button from 'components/Button';
import Input from 'components/Input';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { useAppContext, useEventData, useFormInput, useScrollRestore } from 'hooks';
import config from 'config';
import './Signup.css';

const JoinText = () => <Fragment>Participate in this event by <Anchor href="https://discord.gg/mjtTnr8" target="_blank">joining our Discord</Anchor>.</Fragment>;

const Signup = ({
  history,
  match: { params: { eventID } }
}) => {
  const { user, dispatch } = useAppContext();
  const { events, activeEvent, player } = useEventData(eventID);
  const username = useFormInput(player?.username || '');
  const name = useFormInput(player?.deck?.name || '');
  const mainboard = useFormInput(player?.deck?.mainboard?.join('\n') || '');
  const sideboard = useFormInput(player?.deck?.sideboard?.join('\n') || '');
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState();
  useScrollRestore();

  const handleSignout = useCallback(event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: `/events/signup/${eventID}` });
  }, [dispatch, eventID]);

  useEffect(() => {
    if (!activeEvent || activeEvent.fired) history.push(`/events/${eventID}`);
  }, [activeEvent, history, eventID]);

  useEffect(() => {
    if (activeEvent && !user) {
      handleSignout();
      window.location = config.authURL;
    }
  }, [activeEvent, user, handleSignout]);

  const onSubmit = useCallback(async event => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await fetch(`/functions/events/signup/${eventID}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'secret': config.secret,
        },
        body: JSON.stringify({
          player: user?.id,
          username: username.value,
          name: name.value,
          mainboard: mainboard.value,
          sideboard: sideboard.value,
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
  }, [eventID, user, username.value, name.value, mainboard.value, sideboard.value, submitting]);

  return (
    <Fragment>
      {(events && !activeEvent) && <NotFound />}
      {activeEvent &&
        <Fragment>
          <Helmet
            title="Signup - Project Modern"
          />
          <PageLayout>
            {!complete &&
              <Hero
                title2="Complete your signup"
              >
                <form className="signup__form" onSubmit={onSubmit}>
                  {activeEvent?.platform !== 'PAPER' &&
                    <div className="signup__grid">
                      <Input required {...username} placeholder={`${activeEvent?.platform} Username`} />
                      <Input {...name} placeholder="Deck Name (Optional)" />
                    </div>
                  }
                  {activeEvent?.platform === 'PAPER' &&
                    <Input {...name} placeholder="Deck Name (Optional)" />
                  }
                  <label className="signup__form-label">Decklist</label>
                  <Input textarea required {...mainboard} placeholder="Mainboard" />
                  <Input textarea {...sideboard} placeholder="Sideboard" />
                  <div className="signup__grid signup__grid--submit">
                    <Button label={player ? 'Update' : 'Submit'} />
                    {user &&
                      <p className="signup__comment">
                        Signed in as {user.username}#{user.discriminator}. <Anchor secondary href={`https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirect)}&response_type=code&scope=identify`} onClick={handleSignout}>Not you?</Anchor>
                      </p>
                    }
                  </div>
                </form>
              </Hero>
            }
            {complete &&
              <Hero
                title2="You're signed up!"
                paragraph={<JoinText />}
                button={{
                  as: Link,
                  to: `/events/${eventID}`,
                  label: 'Continue'
                }}
              />
            }
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
};

export default Signup;
