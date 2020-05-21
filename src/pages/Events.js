import React, { useState, useEffect, useRef, Suspense, Fragment, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Label, Title, Title2, Paragraph } from 'components/Type';
import Icon from 'components/Icon';
import { Link } from 'components/Link';
import { AnimFade } from 'utils/style';
import Button from 'components/Button';
import GetStarted from 'pages/GetStarted';
import PageLayout from 'components/PageLayout';
import NotFound from 'pages/NotFound';
import { useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Events(props) {
  const { id, sectionRef, visible, ...rest } = props;
  const titleId = `${id}-title`;
  const [events, setEvents] = useState();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/functions/events', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) return false;

        const data = await response.json();

        return data && setEvents(data);
      } catch (error) {
        return console.error(error.message);
      }
    }

    if (!prerender) fetchEvents();
  }, []);

  if (!sectionRef) return (
    <Suspense fallback={<Fragment />}>
      <Switch>
        <Route exact path="/events" component={EventsPage} />
        <Route component={EventsListing} events={events} />
      </Switch>
    </Suspense>
  );

  return (
    <EventsPanel
      id={id}
      titleId={titleId}
      sectionRef={sectionRef}
      visible={visible}
      events={events}
      {...rest}
    />
  );
}

function EventsListing(props) {
  const { events } = props;
  const { pathname } = useLocation();
  const path = pathname.replace('/events/', '');
  const id = path.includes('/') ? path.replace('/', '') : path;
  const [visible, setVisible] = useState();
  const cta = useRef();

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

    if(events && events[id]) sectionObserver.observe(cta.current);

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visible, events, id]);

  if (!events || !events[id]) return <NotFound />;
  const { name, description, ...rest } = events[id];

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
                  {Object.values(rest)?.map(val => (
                    <Tag key={val}>{val}></Tag>
                  ))}
                </EventsInfoAside>
                <EventsInfo>
                  <Title2>{name}</Title2>
                  <Paragraph>{description}</Paragraph>
                  <Button label="Signup" to={`/signup/${id}`} />
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
  width: 30%;

  @media (max-width: ${props => props.theme.mobile}px) {
    margin-top: 10px;
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

const EventsInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;

  ${Paragraph} {
    margin-top: 30px;

    :first-of-type {
      margin-top: 50px;
    }
  }

  a {
    justify-self: flex-end;
    margin-top: 60px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 100%;

    a {
      margin-top: 45px;
    }
  }
`;

function EventsPage(props) {
  const [visibleSections, setVisibleSections] = useState([]);
  const events = useRef();
  const getStarted = useRef();
  useScrollRestore();

  useEffect(() => {
    const revealSections = [events, getStarted];

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);
          if (visibleSections.includes(section)) return;
          setVisibleSections(prevSections => [...prevSections, section]);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <Fragment>
      <Helmet
        title="Events - Project Modern"
      />
      <PageLayout>
        <EventsHeroWrapper>
          <Transition
            appear={!prerender}
            in={!prerender}
            timeout={3000}
            onEnter={reflow}
          >
            {status => (
              <EventsHeroContainer status={status}>
                <EventsHeroContent>
                  <Label>Events</Label>
                  <Title>Level up your skills with daily tournaments</Title>
                </EventsHeroContent>
              </EventsHeroContainer>
            )}
          </Transition>
        </EventsHeroWrapper>
        <EventsPanel
          alternate
          id="events"
          sectionRef={events}
          visible={visibleSections.includes(events.current)}
        />
        <GetStarted
          id="get-started"
          sectionRef={getStarted}
          visible={visibleSections.includes(getStarted.current)}
        />
      </PageLayout>
    </Fragment>
  );
}

const EventsHeroWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackground};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsHeroContainer = styled.div`
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

const EventsHeroContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 180px 0;
  padding-left: 50px;

  ${Label} {
    left: -50px;
    position: relative;
  }

  ${Title} {
    margin-top: 45px;
    width: 56%;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    ${Title} {
      width: 70%;
    }
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }

    ${Title} {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px 0;
    padding-left: 0;

    ${Label} {
      left: 0;
    }
  }
`;

const EventsPanel = ({
  id,
  titleId,
  sectionRef,
  visible,
  events,
  alternate,
  ...rest
}) => (
  <EventsWrapper
    ref={sectionRef}
    id={id}
    aria-labelledby={titleId}
    tabIndex={-1}
    {...rest}
  >
    <Transition
      in={visible}
      timeout={4000}
      onEnter={reflow}
    >
      {status => (
        <EventsContainer status={status}>
          <EventsContent alternate={alternate}>
            {!alternate && <Label>Active Events</Label>}
            <Title2 id={titleId}>{alternate ? 'Active Events' : 'New Tourmaments Every Day'}</Title2>
            <Tournaments alternate={alternate}>
              {!events && <Paragraph>There aren't any active events right now.</Paragraph>}
              {events?.map(({ id, name, description }) => (
                <Tournament to={`/${events}/${id}`} aria-label={name}>
                  <TournamentName>
                    <span>{name}</span>
                    <div></div>
                  </TournamentName>
                  <TournamentInfo>{description}</TournamentInfo>
                  <Icon icon="plus" />
                </Tournament>
              ))}
            </Tournaments>
            {!alternate && <Button to="/events" label="All Events" />}
          </EventsContent>
        </EventsContainer>
      )}
    </Transition>
  </EventsWrapper>
);

const EventsWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackgroundSecondary};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const EventsContainer = styled.div`
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

const EventsContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 180px 0;
  padding-left: 50px;

  ${Label} {
    left: -50px;
    position: relative;
  }

  ${Title2} {
    margin-top: 40px;
    max-width: 564px;

    ${props => props.alternate && css`
      align-self: flex-end;
      margin-top: 0;
    `}
  }

  a {
    margin: 60px auto 0;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px 0;
    padding-left: 0;

    ${Label} {
      left: 0;
    }

    ${Title2} {
      max-width: none;

      ${props => props.alternate && css`
        align-self: flex-start;
      `}
    }

    a {
      margin: 45px 0 0;
    }
  }
`;

const Tournaments = styled.div`
  align-self: ${props => props.alternate ? 'flex-start' : 'flex-end'};
  display: grid;
  grid-row-gap: 20px;
  margin: 20px 0 0;
  max-width: 624px;
  width: 100%;

  svg {
    color: ${props => props.theme.colorAccent};
    position: absolute;
    right: 0;
    top: 50px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: none;

    ${props => !props.alternate && css`
      align-self: flex-start;
    `}
  }
`;

const TournamentName = styled.h4`
  align-self: flex-start;
  color: ${props => props.theme.colorTitle};
  flex: none;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 44px;
  position: relative;

  span {
    position: relative;
    z-index: 2;
  }

  div {
    background-color: #eee;
    bottom: 0;
    height: 26px;
    position: absolute;
    right: -20px;
    transform-origin: right;
    transform: scaleX(0);
    transition: transform 0.85s ${props => props.theme.ease2};
    width: 100%;
    z-index: 1;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 20px;
    line-height: 26px;
  }
`;

const Tournament = styled(Link)`
  display: flex;
  flex-direction: column;
  height: 145px;
  justify-content: center;
  position: relative;
  text-decoration: none;

  ::after {
    background-color: rgb(234, 234, 234);
    bottom: 0;
    content: '';
    height: 1px;
    left: 0;
    position: absolute;
    width: 100%;
  }

  :hover, :active, :focus {
    ${TournamentName} div {
      transform: scale(1);
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    height: 100px;
  }
`;

const TournamentInfo = styled.p`
  color: ${props => props.theme.colorText};
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
  line-height: 36px;
  margin-top: 10px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

export default memo(Events);
