import React, { useState, Fragment, useCallback } from 'react';
import styled, { css } from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2 } from 'components/Type';
import Button from 'components/Button';
import TextArea from 'components/TextArea';
import Anchor from 'components/Anchor';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { AnimFade } from 'utils/style';
import { useScrollRestore, useFormInput, useAppContext } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';

function EventSignup() {
  const { pathname } = useLocation();
  const id = pathname.replace('/events/signup/', '').replace('/', '');
  const { user, dispatch } = useAppContext();
  const username = useFormInput('');
  const name = useFormInput('');
  const mainboard = useFormInput('');
  const sideboard = useFormInput('');
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState();
  useScrollRestore();

  const handleSignout = event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: `/events/signup/${id}` });
  };

  const onSubmit = useCallback(async event => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await fetch(`/functions/events/signup/${id}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
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
    } catch (error) {
      setSubmitting(false);
      alert(error.message);
    }
  }, [id, user, username.value, name.value, mainboard.value, sideboard.value, submitting]);

  if (!id) return <NotFound />;

  return (
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
                      <HalvedGrid>
                        <FormInput {...username} placeholder="MTGO Username" required />
                        <FormInput {...name} placeholder="Deck Name (Optional)" />
                      </HalvedGrid>
                      <FormLabel>Decklist</FormLabel>
                      <FormTextArea {...mainboard} placeholder="Mainboard" required />
                      <FormTextArea {...sideboard} placeholder="Sideboard" />
                      <SubmitGrid>
                        <Button label="Submit" />
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
                  </EventsSignupContent>
                </EventsSignupContainer>
              )}
            </Transition>
          }
        </EventsSignupWrapper>
      </PageLayout>
    </Fragment>
  );
}

const EventsSignupWrapper = styled.section`
  align-items: center;
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsSignupContainer = styled.section`
  margin: 0 auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
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

  @media (max-width: ${props => props.theme.tablet}px) {
    ${Title2} {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    justify-content: center;
    margin-top: 75px;
  }
`;

const Form = styled.form`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-top: 100px;

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-top: 50px;
    width: 100%;
  }
`;

const HalvedGrid = styled.div`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: 1fr 1fr;
  width: 100%;

  @media (max-width: ${props => props.theme.mobile}px) {
    grid-template-columns: 1fr;
  }
`;

const inputStyles = css`
  background:
    linear-gradient(${props => props.theme.colorBackgroundDarkSecondary}, ${props => props.theme.colorBackgroundDarkSecondary}) no-repeat 100% 100% / 0 1px,
    linear-gradient(#bcbcbc, #bcbcbc) no-repeat 0 100% / 100% 1px;
  border: none;
  caret-color: ${props => props.theme.colorAccent};
  font-family: inherit;
  font-size: 100%;
  height: 70px;
  line-height: 1.15;
  margin: 0;
  padding: 26px 0;
  transition: background-size 0.4s ${props => props.theme.ease1};
  width: 100%;

  &:focus {
    background:
      linear-gradient(${props => props.theme.colorBackgroundDarkSecondary}, ${props => props.theme.colorBackgroundDarkSecondary}) no-repeat 0 100% / 100% 1px,
      linear-gradient(#bcbcbc, #bcbcbc) no-repeat 0 100% / 100% 1px;
  }
`;

const FormInput = styled.input`
  ${inputStyles}
`;

const FormLabel = styled.label`
  color: ${props => props.theme.colorTitle};
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 36px;
  margin: 60px 0 20px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 14px;
    line-height: 28px;
  }
`;

const FormTextArea = styled(TextArea)`
  ${inputStyles}
  height: 140px;
  margin-bottom: 20px;
`;

const SubmitGrid = styled(HalvedGrid)`
  grid-template-columns: 175px auto;
  margin-top: 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-top: 30px;
    display: block;
  }
`;

const Comment = styled.p`
  &, a {
    color: ${props => props.theme.colorText};
    font-size: 16px;
    letter-spacing: 0.05em;
    line-height: 48px;

    @media (max-width: ${props => props.theme.mobile}px) {
      line-height: 26px;
      margin-top: 20px;
    }
  }
`;

export default EventSignup;
