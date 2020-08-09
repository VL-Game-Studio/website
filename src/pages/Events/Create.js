import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import Button from 'components/Button';
import Input from 'components/Input';
import Anchor from 'components/Anchor';
import PageLayout from 'components/PageLayout';
import { Link } from 'components/Link';
import { useAppContext, useFormInput, useScrollRestore } from 'hooks';
import config from 'config';
import './Create.css';

const Create = () => {
  const { user, dispatch } = useAppContext();
  const authorized = config?.admins?.includes(user?.id);
  const [submitting, setSubmitting] = useState();
  const [complete, setComplete] = useState();
  const name = useFormInput('');
  const description = useFormInput('');
  const platform = useFormInput('');
  const date = useFormInput('');
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
          description: description.value,
          platform: platform.value,
          time: `${date.value}T${time.value}:00Z`,
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
  }, [name.value, description.value, platform.value, date.value, time.value, submitting]);

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
                <form className="create__form" onSubmit={onSubmit}>
                  <label className="create__form-label">Event Details</label>
                  <div className="create__halved-grid">
                    <Input {...name} required placeholder="Event Name" />
                    <Input {...platform} required as="select">
                      <option>Event Platform</option>
                      {['MTGO', 'Paper', 'xMage', 'Cockatrice', 'Untap', 'Multi-Platform'].map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </Input>
                  </div>
                  <Input {...description} textarea placeholder="Event Description" />
                  <label className="create__form-label">Event Date and Time (UTC)</label>
                  <div className="create__halved-grid">
                    <Input {...date} required type="date" />
                    <Input {...time} required type="time" />
                  </div>
                  <div className="create__submit-grid">
                    <Button label="Create" />
                    {user &&
                      <p className="create_comment">Signed in as {user.username}#{user.discriminator}. <Anchor secondary href={`https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirect)}&response_type=code&scope=identify`} onClick={handleSignout}>Not you?</Anchor></p>
                    }
                  </div>
                </form>
              </Hero>
            }
            {complete &&
              <Hero
                title2="Event created."
                button={{
                  as: Link,
                  to: '/events',
                  label: 'Back to Events'
                }}
              />
            }
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
};

export default Create;
