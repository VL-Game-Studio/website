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
  const { name, description, ...rest } = event;

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
                <EventsInfoAside>
                  {Object.values(rest)?.map(val => (val !== id && val !== event.players) && (
                    <Tag key={val}>{val}</Tag>
                  ))}
                  {isMobile && <Button style={{ marginTop: '50px' }} label="Signup" {...buttonProps} />}
                  <RelatedEvents>
                    <h4>Recent Events</h4>
                    {events?.map(({ id, name }, index) => index < 4 && (
                      <Anchor
                        key={id}
                        secondar={1}
                        as={Link}
                        to={`/events/${id}`}
                      >
                        {name}
                      </Anchor>
                    ))}
                  </RelatedEvents>
                </EventsInfoAside>
                <EventsInfo>
                  <Title2>{name}</Title2>
                  <Paragraph>{description}</Paragraph>
                  {!isMobile && <Button label="Signup" {...buttonProps} />}
                </EventsInfo>
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
  display: flex;
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

  @media (max-width: ${props => props.theme.mobile}px) {
    flex-direction: column-reverse;
    max-width: 100%;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px auto;
  }
`;

const EventsInfoAside = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 30%;

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-top: 50px;
    width: 100%;
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

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-top: 50px;

    a {
      margin-top: 17px;

      :first-of-type {
        margin-top: 0;
      }
    }
  }
`;

const EventsInfo = styled.div`
  display: grid;
  flex-direction: column;
  width: 70%;

  ${Paragraph} {
    margin-top: 30px;

    :first-of-type {
      margin-top: 50px;
    }
  }

  a {
    align-self: flex-end;
    margin-top: 60px;
    width: 0;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 100%;

    a {
      margin-top: 45px;
    }
  }
`;

export default EventInfo;
