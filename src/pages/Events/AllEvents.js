import React, { useState, useEffect, useRef, Fragment, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Label, Title } from 'components/Type';
import PageLayout from 'components/PageLayout';
import EventsPanel from './EventsPanel';
import GetStarted from 'pages/GetStarted';
import { AnimFade } from 'utils/style';
import { useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function AllEvents(props) {
  const { events } = props;
  const [visibleSections, setVisibleSections] = useState([]);
  const eventsList = useRef();
  const getStarted = useRef();
  useScrollRestore();

  useEffect(() => {
    const revealSections = [eventsList, getStarted];

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
          events={events}
          sectionRef={eventsList}
          visible={visibleSections.includes(eventsList.current)}
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

export default memo(AllEvents);
