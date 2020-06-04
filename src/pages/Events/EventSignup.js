import React, { useState, useEffect, useCallback, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import Button from 'components/Button';
import Input from 'components/Input';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { AnimFade, media } from 'utils/style';
import { useAppContext, useFormInput, useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';

function EventSignup(props) {
  const { history, match: { params: { eventID } } } = props;
  const { events, user, dispatch } = useAppContext();
  const activeEvent = events?.length > 0 && events?.filter(({ id }) => id === eventID)[0];
  const isPlaying = user && activeEvent?.players[user?.id];
  const username = useFormInput(isPlaying?.username || '');
  const name = useFormInput(isPlaying?.deck?.name || '');
  const mainboard = useFormInput(isPlaying?.deck?.mainboard?.join('\n') || '');
  const sideboard = useFormInput(isPlaying?.deck?.sideboard?.join('\n') || '');
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState();
  useScrollRestore();

  const handleSignout = useCallback(event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: `/events/signup/${eventID}` });
  }, [dispatch, eventID]);

  useEffect(() => {
    if (!activeEvent) history.push('/events');
  }, [activeEvent, history]);

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
      {(events && activeEvent) &&
        <Fragment>
          <Helmet
            title="Signup - Project Modern"
          />
          <PageLayout>
            <EventsSignupWrapper>
              {!complete &&
                <Transition
                  appear={!prerender}
                  in={!prerender}
                  timeout={3000}
                  onEnter={reflow}
                >
                  {status => (
                    <EventsSignupContainer status={status}>
                      <EventsSignupContent>
                        <Title2>Complete your signup</Title2>
                        <Form onSubmit={onSubmit}>
                          {activeEvent?.platform !== 'PAPER' &&
                            <HalvedGrid>
                              <Input required {...username} placeholder={`${activeEvent?.platform} Username`} />
                              <Input {...name} placeholder="Deck Name (Optional)" />
                            </HalvedGrid>
                          }
                          {activeEvent?.platform === 'PAPER' &&
                            <Input {...name} placeholder="Deck Name (Optional)" />
                          }
                          <FormLabel>Decklist</FormLabel>
                          <Input textarea required {...mainboard} placeholder="Mainboard" />
                          <Input textarea {...sideboard} placeholder="Sideboard" />
                          <SubmitGrid>
                            <Button label={isPlaying ? 'Update' : 'Submit'} />
                            {user &&
                              <Comment>Signed in as {user.username}#{user.discriminator}. <Anchor secondary href={`https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirect)}&response_type=code&scope=identify`} onClick={handleSignout}>Not you?</Anchor></Comment>
                            }
                          </SubmitGrid>
                        </Form>
                      </EventsSignupContent>
                    </EventsSignupContainer>
                  )}
                </Transition>
              }
              {complete &&
                <Transition
                  appear={!prerender}
                  in={!prerender}
                  timeout={3000}
                  onEnter={reflow}
                >
                  {status => (
                    <EventsSignupContainer status={status}>
                      <EventsSignupContent>
                        <Title2>You're signed up!</Title2>
                        <Paragraph style={{ marginTop: '30px' }}>Participate in this event by <Anchor as={Link} to="/" onClick={() => window.open('https://discord.gg/mjtTnr8')}>joining our Discord</Anchor>.</Paragraph>
                        <Button style={{ marginTop: '50px' }} to={`/events/${eventID}`} label="Continue" />
                      </EventsSignupContent>
                    </EventsSignupContainer>
                  )}
                </Transition>
              }
            </EventsSignupWrapper>
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
}

const EventsSignupWrapper = styled.section`
  align-items: center;
  display: flex;
  padding: 0 50px;

  @media (max-width: ${media.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsSignupContainer = styled.section`
  margin: 0 auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${media.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${media.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${media.mobile}px) {
    max-width: 100%;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const EventsSignupContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 140px 0;

  ${Title2} {
    margin-top: 40px;
    width: 56%;
  }

  @media (max-width: ${media.laptop}px) {
    ${Title2} {
      width: 70%;
    }
  }

  @media (max-width: ${media.tablet}px) {
    ${Title2} {
      width: 100%;
    }
  }

  @media (max-width: ${media.mobile}px) {
    justify-content: center;
    margin-top: 75px;
  }
`;

const Form = styled.form`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 100px;

  @media (max-width: ${media.mobile}px) {
    margin-top: 50px;
    width: 100%;
  }
`;

const HalvedGrid = styled.div`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  @media (max-width: ${media.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  color: ${props => props.theme.colorTitle};
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 36px;
  margin: 60px 0 20px;

  @media (max-width: ${media.mobile}px) {
    font-size: 14px;
    line-height: 28px;
  }
`;

const SubmitGrid = styled(HalvedGrid)`
  grid-template-columns: 175px auto;
  margin-top: 50px;

  @media (max-width: ${media.mobile}px) {
    margin-top: 30px;
    display: block;
  }
`;

const Comment = styled.p`
  &, a {
    color: var(--colorTextBody);
    font-size: 16px;
    letter-spacing: 0.05em;
    line-height: 48px;

    @media (max-width: ${media.mobile}px) {
      line-height: 26px;
      margin-top: 20px;
    }
  }
`;

export default EventSignup;
