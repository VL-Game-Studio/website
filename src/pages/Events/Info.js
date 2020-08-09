import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { useAppContext, useEventData, useWindowSize, useScrollRestore } from 'hooks';
import { media } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';
import './Info.css';

/**
 * Fixes timezone offset from UTC time to local time
 */
function correctDate(time)  {
  let date = new Date(time);
  date = new Date(date.getTime() + Math.abs(date.getTimezoneOffset() * 60000));

  return date;
}

const Info = ({
  match: { params: { eventID } }
}) => {
  const history = useHistory();
  const { user, dispatch } = useAppContext();
  const { events, activeEvent, otherEvents, player } = useEventData(eventID);
  const cta = useRef();
  const [visible, setVisible] = useState();
  const [dropping, setDropping] = useState();
  const { width } = useWindowSize();
  const isMobile = width <= media.mobile;
  useScrollRestore();

  const handleRedirect = () => {
    dispatch({ type: 'setRedirect', value: `/events/signup/${eventID}` });
  };

  const Controls = () => !activeEvent?.closed && (
    <div className="info__grid">
      <Button
        as={user ? Link : 'a'}
        onClick={user ? null : handleRedirect}
        href={user ? null : config.authURL}
        to={`/events/signup/${eventID}`}
        label={player ? 'Update' : 'Signup'}
      />
      {player &&
        <Paragraph>
          Not doing so hot?&nbsp;
          <Anchor
            secondary
            as={Link}
            to="/events"
            onClick={handleDrop}
            aria-label="Drop Event"
          >
            Drop
          </Anchor>
        </Paragraph>
      }
    </div>
  );

  const handleDrop = useCallback(async event => {
    event.preventDefault();
    if (dropping) return;

    try {
      setDropping(true);

      const response = await fetch(`/functions/events/drop/${eventID}/${user?.id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'secret': config.secret,
        },
      });

      const data = await response.json();
      if (response.status !== 200) throw new Error(data?.error || response.statusText);

      return history.push('/events');
    } catch (error) {
      setDropping(false);
      alert(error.message);
    }
  }, [dropping, eventID, user, history]);

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);

          return visible ? false : setVisible(true);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    if (activeEvent) sectionObserver.observe(cta.current);

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visible, activeEvent]);

  return (
    <Fragment>
      {(!activeEvent && events) && <NotFound />}
      {(activeEvent || !events) &&
        <Fragment>
          <Helmet
            title={`Event ${activeEvent?.name || ''} - Project Modern`}
          />
          <PageLayout>
            <Transition
              appear={!prerender}
              in={!prerender}
              timeout={3000}
              onEnter={reflow}
            >
              {status => (
                <section className="info__wrapper">
                  <header className={classNames('info__header', `info__header--${status}`)}>
                    <div className="info__panel">
                      <Title2 loading={!activeEvent?.name ? 1 : 0}>{activeEvent.name}</Title2>
                      <Paragraph loading={!activeEvent?.description ? 1 : 0}>{activeEvent.description}</Paragraph>
                      {!isMobile && <Controls />}
                    </div>
                    <div className="info__panel">
                      <div>
                        <Paragraph className="info__tag" loading={!activeEvent?.time ? 1 : 0}>
                          <label>Date:</label>
                          {activeEvent?.time && correctDate(activeEvent.time).toLocaleDateString('default', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Paragraph>
                        <Paragraph className="info__tag" loading={!activeEvent?.time ? 1 : 0}>
                          <label>Time:</label>
                          {activeEvent?.time && new Date(activeEvent.time).toLocaleTimeString('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short',
                          })}
                        </Paragraph>
                        {activeEvent?.platform &&
                          <Paragraph className="info__tag">
                            <label>Platform:</label>
                            {activeEvent.platform}
                          </Paragraph>
                        }
                        {activeEvent?.players &&
                          <Paragraph className="info__tag">
                            <label>Players:</label>
                            {Object.values(activeEvent.players).length}
                          </Paragraph>
                        }
                      </div>
                      {isMobile && <Controls />}
                      {(!activeEvent || otherEvents?.length > 1) &&
                        <div className="info__related-events">
                          <h4>Other Events</h4>
                          {!activeEvent &&
                            <Paragraph loading={1}>
                              <br/><br/><br/>
                            </Paragraph>
                          }
                          {otherEvents && otherEvents?.map(({ id, name }, index) => index < 4 && (
                            <Anchor
                              key={id}
                              secondary={1}
                              as={Link}
                              to={`/events/${id}`}
                            >
                              {name}
                            </Anchor>
                          ))}
                        </div>
                      }
                    </div>
                  </header>
                </section>
              )}
            </Transition>
            <GetStarted
              accent
              sectionRef={cta}
              visible={visible}
            />
          </PageLayout>
        </Fragment>
      }
    </Fragment>
  );
};

export default Info;
