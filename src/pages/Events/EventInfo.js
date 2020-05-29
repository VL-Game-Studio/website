import React, { useState, useEffect, useRef, Fragment } from 'react';
import styled, { css, useTheme } from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Anchor from 'components/Anchor';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { AnimFade } from 'utils/style';
import { useScrollRestore, useWindowSize, useAppContext } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';
import config from 'config';

function EventInfo(props) {
  const { events } = props;
  const { pathname } = useLocation();
  const id = pathname.replace('/events/', '').replace('/', '');
  const event = events?.filter(event => event.id === id)[0];
  const { user, dispatch } = useAppContext();
  const [visible, setVisible] = useState();
  const cta = useRef();
  const { width } = useWindowSize();
  const { mobile } = useTheme();
  const isMobile = width <= mobile;
  useScrollRestore();

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

    if (event) sectionObserver.observe(cta.current);

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visible, event, id]);

  if (!event) return <NotFound />;
  const { name, description, date, time, platform, players = [] } = event;

  let day = new Date(date);
  day = new Date(day.getTime() + day.getTimezoneOffset() * 60000);

  const handleRedirect = () => {
    dispatch({ type: 'setRedirect', value: `/events/signup/${id}` });
  };

  const buttonProps = user
    ? {
      to: `/events/signup/${id}`
    }
    : {
      onClick: handleRedirect,
      href: `https://discord.com/api/oauth2/authorize?client_id=${config.clientID}&redirect_uri=${encodeURI(config.redirect)}&response_type=code&scope=identify`
    };

  return (
    <Fragment>
      <Helmet
        title={`Event ${name} - Project Modern`}
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
                  <Title2>{name}</Title2>
                  <Paragraph>{description}</Paragraph>
                  {!isMobile && <Button label="Signup" {...buttonProps} />}
                </InfoPanel>
                <InfoPanel>
                  <div>
                    <Tag>
                      <label>Date:</label>
                      {new Date(day).toLocaleDateString('default', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Tag>
                    <Tag>
                      <label>Time:</label>
                      {time}
                    </Tag>
                    <Tag>
                      <label>Platform:</label>
                      {platform}
                    </Tag>
                    <Tag>
                      <label>Players:</label>
                      {Object.values(players).length}
                    </Tag>
                  </div>
                  {isMobile && <Button style={{ marginTop: '50px' }} label="Signup" {...buttonProps} />}
                  <RelatedEvents>
                    <h4>Other Events</h4>
                    {events?.filter(e => e.id !== id).map(({ id, name }, index) => index < 4 && (
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
  );
}

const EventsInfoWrapper = styled.div`
  align-items: center;
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsInfoHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin: 180px auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
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

  @media (max-width: ${props => props.theme.tablet}px) {
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
  color: ${props => props.theme.colorTitle};
  display: flex;
  margin-top: 12px;

  :first-of-type {
    margin-top: 0;
  }

  ::before {
    background-color: ${props => props.theme.colorAccent};
    border-radius: 50%;
    content: '';
    display: inline-block;
    height: 4px;
    margin-right: 20px;
    width: 4px;
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
    color: ${props => props.theme.colorTitle};
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

  @media (max-width: ${props => props.theme.tablet}px) {
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
