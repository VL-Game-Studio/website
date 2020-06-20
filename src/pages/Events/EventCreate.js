import React, { useState, useEffect, useCallback, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import Button from 'components/Button';
import Input from 'components/Input';
import Anchor from 'components/Anchor';
import PageLayout from 'components/PageLayout';
import { media } from 'utils/style';
import { useAppContext, useFormInput, useScrollRestore } from 'hooks';
import config from 'config';

function EventCreate() {
  const { user, dispatch } = useAppContext();
  const authorized = config?.admins?.includes(user?.id);
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState();
  const name = useFormInput('');
  const description = useFormInput('');
  const platform = useFormInput('');
  const time = useFormInput('');
  useScrollRestore();

  const handleSignout = useCallback(event => {
    dispatch({ type: 'setUser', value: null });
    dispatch({ type: 'setRedirect', value: '/events' });
  }, [dispatch]);

  useEffect(() => {
    if (!user || !authorized) {
      handleSignout();
      window.location = config.authURL;
    }
  }, [user, handleSignout, authorized]);

  const onSubmit = useCallback(async event => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const response = await fetch('/functions/events', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'secret': config.secret,
        },
        body: JSON.stringify({
          name: name.value,
          description: description.value === '' ? 'Target start time is 4PM GMT.' : description.value,
          platform: platform.value,
          time: `${time.value}T16:00:00Z`,
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
  }, [name.value, description.value, platform.value, time.value, submitting]);

  return (
    <Fragment>
      {authorized &&
        <Fragment>
          <Helmet
            title="Create Event - Project Modern"
          />
          <PageLayout>
            {!complete &&
              <Hero
                title2="Create an Event"
              >
                <Form onSubmit={onSubmit}>
                  <Input {...name} required placeholder="Event Name" />
                  <Input {...description} textarea placeholder="Event Description" />
                  <FormLabel>Event Details</FormLabel>
                  <HalvedGrid>
                    <Input {...platform} list="platforms" required placeholder="Event Platform" />
                    <datalist id="platforms">
                      {['Paper', 'xMage', 'Cockatrice', 'Untap', 'MTGO'].map(platform => <option key={platform} value={platform}>{platform}</option>)}
                    </datalist>
                    <Input {...time} type="date" required placeholder="UTC start time (2020-06-31T00:00:00Z)" />
                  </HalvedGrid>
                  <SubmitGrid>
                  <Button label="Create" />
                  {user &&
                    <Comment>Signed in as {user.username}#{user.discriminator}. <Anchor secondary href={`https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirect)}&response_type=code&scope=identify`} onClick={handleSignout}>Not you?</Anchor></Comment>
                  }
                </SubmitGrid>
                </Form>
              </Hero>
            }
            {complete &&
              <Hero
                title2="Event created."
                button={{ to: '/events', label: 'Back to Events' }}
              />
            }
          </PageLayout>
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
  }
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

export default EventCreate;
