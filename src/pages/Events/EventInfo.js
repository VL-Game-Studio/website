import React, { useState, useEffect, useRef, Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { AnimFade, media } from 'utils/style';
import { useScrollRestore, useWindowSize, useAppContext } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';

function EventInfo(props) {
  const { match: { params: { eventID } } } = props;
  const { events, user, dispatch } = useAppContext();
  const activeEvent = events?.length > 0 && events.filter(({ id }) => id === eventID)[0];
  const otherEvents = events?.length > 0 && events.filter(({ id }) => id !== eventID);
  const isPlaying = user && activeEvent?.players[user?.id];
  const cta = useRef();
  const [visible, setVisible] = useState();
  const { width } = useWindowSize();
  const isMobile = width <= media.mobile;
  useScrollRestore();

  const handleRedirect = () => {
    dispatch({ type: 'setRedirect', value: `/events/signup/${eventID}` });
  };

  const buttonProps = user
    ? {
      label: isPlaying ? 'Update' : 'Signup',
      to: `/events/signup/${eventID}`
    }
    : {
      label: 'Signup',
      onClick: handleRedirect,
      href: config.authURL
    };

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
                <EventsInfoWrapper>
                  <EventsInfoHeader status={status}>
                    <InfoPanel>
                      <Title2 loading={!activeEvent?.name ? 1 : 0}>{activeEvent.name}</Title2>
                      <Paragraph loading={!activeEvent?.description ? 1 : 0}>{activeEvent.description}</Paragraph>
                      {(activeEvent && !isMobile) && <Button {...buttonProps} />}
                    </InfoPanel>
                    <InfoPanel>
                      <div>
                        <Tag loading={!activeEvent?.time ? 1 : 0}>
                          <label>Date:</label>
                          {activeEvent?.time && new Date(parseInt(activeEvent.time)).toLocaleDateString('default', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Tag>
                        <Tag loading={!activeEvent?.time ? 1 : 0}>
                          <label>Time:</label>
                          {activeEvent?.time && new Date(parseInt(activeEvent.time)).toLocaleTimeString('default', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short',
                          })}
                        </Tag>
                        {activeEvent?.platform &&
                          <Tag>
                            <label>Platform:</label>
                            {activeEvent.platform}
                          </Tag>
                        }
                        {activeEvent?.players &&
                          <Tag>
                            <label>Players:</label>
                            {Object.values(activeEvent.players).length}
                          </Tag>
                        }
                      </div>
                      {(activeEvent && isMobile) && <Button style={{ marginTop: '50px' }} {...buttonProps} />}
                      <RelatedEvents>
                        <h4>{otherEvents.length > 0 && 'Other Events'}</h4>
                        {!otherEvents.length > 0 &&
                          <Paragraph loading={1}>
                            <br/><br/><br/>
                          </Paragraph>
                        }
                        {activeEvent && otherEvents.map(({ id, name }, index) => index < 4 && (
                          <Anchor
                            key={id}
                            secondary={1}
                            as={Link}
                            to={`/events/${id}`}
                          >
                            {name}
                          </Anchor>
                        ))}
                      </RelatedEvents>
                    </InfoPanel>
                  </EventsInfoHeader>
                </EventsInfoWrapper>
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
}

const EventsInfoWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 0 50px;

  @media (max-width: ${media.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsInfoHeader = styled.div`
  display: grid;
  grid-gap: 60px;
  grid-template-columns: 1fr auto;
  margin: 180px auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${media.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${media.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${media.tablet}px) {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  @media (max-width: ${media.mobile}px) {
    grid-gap: 45px;
    margin: 96px auto;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const InfoPanel = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  position: relative;

  :first-of-type {
    ${Paragraph} {
      margin-top: 30px;

      :first-of-type {
        margin-top: 50px;
      }
    }

    a {
      bottom: 0;
      margin-top: 60px;
      position: absolute;
      width: 0;
    }
  }

  @media (max-width: ${media.tablet}px) {
    width: 100%;
    margin-top: 50px;

    :first-of-type {
      margin-top: 0;

      a {
        margin-top: 45px;
        position: relative;
      }
    }
  }
`;

const Tag = styled(Paragraph)`
  align-items: center;
  color: var(--colorTextTitle);
  display: flex;
  margin-top: 12px;

  :first-of-type {
    margin-top: 0;
  }

  ::before {
    background-color: rgb(var(--rgbAccent));
    border-radius: 50%;
    content: '';
    display: inline-block;
    height: 4px;
    margin-right: 20px;
    width: 4px;
    align-self: center;
  }

  label {
    font-weight: 600;
    margin-right: 10px;
  }
`;

const RelatedEvents = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  margin-top: 250px;

  h4 {
    color: var(--colorTextTitle);
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.16em;
    line-height: 28px;
    margin-bottom: 10px;
    text-transform: uppercase;
  }

  a {
    margin: 7px 0;
  }

  @media (max-width: ${media.tablet}px) {
    margin-top: 50px;

    a {
      margin-top: 17px;

      :first-of-type {
        margin-top: 0;
      }
    }
  }
`;

export default EventInfo;
