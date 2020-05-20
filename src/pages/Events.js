import React, { useState, useEffect, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title2, Paragraph } from 'components/Type';
import { AnimFade } from 'utils/style';
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

  return (
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
            <EventsContent>
              <Label>Active Events</Label>
              <Title2 id={titleId}>New Tourmaments Every Day</Title2>
              <EventsList>
                {!events && <Paragraph>There aren't any active tournaments right now.</Paragraph>}
              </EventsList>
            </EventsContent>
          </EventsContainer>
        )}
      </Transition>
    </EventsWrapper>
  );
}

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
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    padding-left: 0;

    ${Label} {
      left: 0;
    }

    ${Title2} {
      max-width: none;
    }
  }
`;

const EventsList = styled.div`
  align-self: flex-end;
  display: grid;
  grid-row-gap: 20px;
  margin-top: 20px;
  max-width: 624px;
  width: 100%;

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: none;
  }
`;

export default memo(Events);
