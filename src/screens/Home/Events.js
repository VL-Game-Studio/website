import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import Wrapper from 'components/Wrapper';
import { Label, Title } from 'components/Type';
import Button from 'components/Button';
import { Link } from 'components/Link';
import { rgba } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

export default function Events(props) {
  const { id, sectionRef, visible = true, ...rest } = props;
  const labelId = `${id}-label`;
  const [events, setEvents] = useState();
  const [complete, setComplete] = useState();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/functions/events', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) throw new Error(`An error occured while fetching events: Error ${response.status} - ${response.statusText}`);

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        setComplete(true);
        return data && setEvents(data);
      } catch (error) {
        setComplete(false);
        return console.error(error.message);
      }
    }

    if (!prerender || !visible) fetchEvents();
  }, [visible]);

  return (
    <Background>
      <Wrapper
        ref={sectionRef}
        id={id}
        aria-labelledby={labelId}
        {...rest}
      >
        <Transition
          in={visible}
          timeout={0}
          onEnter={reflow}
        >
          {status => (
            <Fragment>
              <EventsContent status={status}>
                <Column>
                  <Label id={labelId} aria-label="Events">Events</Label>
                  <Title>Daily player-driven events from open play to competitive tournaments.</Title>
                </Column>
                <EventsList>
                  {(!complete && complete !== false) && `Fetching events...`}
                  {complete === false && `No events are currently scheduled.`}
                  {complete && Object.values(events).map(({ id, date, time, name, limit, players, platform }) => {
                    const [month, day] = date.split(',')[0].split(' ');
                    const path = `/events/${id}`;

                    return (
                      <Event key={id}>
                        <EventDetails>
                          <h1>{day}</h1>
                          <Column>
                            <h2>{month}</h2>
                            <p>{time}</p>
                          </Column>
                          <Column>
                            <h2>{name}</h2>
                            <p>Players: {players ? Object.values(players).length : 0}/{limit} Platform: {platform}</p>
                          </Column>
                        </EventDetails>
                        <EventControls>
                          <Button as={Link} to={path} label="Register" />
                        </EventControls>
                      </Event>
                    );
                  })}
                </EventsList>
              </EventsContent>
            </Fragment>
          )}
        </Transition>
      </Wrapper>
    </Background>
  );
}

const Background = styled.div`
  background: ${props => props.theme.colorBackgroundLight};
  border-bottom: 1px solid ${props => rgba(props.theme.colorBlack, 0.1)};
  border-top: 1px solid ${props => rgba(props.theme.colorBlack, 0.1)};
`;

const EventsContent = styled.div`
  display: grid;
  grid-gap: 142px;
  grid-template-columns: 280px 652px;
  padding: 90px 120px;

  @media (max-width: ${props => props.theme.laptop}px) {
    grid-gap: 0;
    grid-row-gap: 32px;
    grid-template-columns: 1fr;
    padding: 30px 40px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventsList = styled(Column)`
  background: ${props => props.theme.colorBackground};
  padding: 40px 60px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 12px 24px;
  }
`;

const Event = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr 1fr;
  margin-top: 30px;

  :first-of-type {
    margin-top: 0;
  }
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: row;

  ${Column} {
    margin-left: 24px;
  }

  h1 {
    color: ${props => props.theme.colorAccent};
    font-size: 42px;
    font-weight: 700;
  }

  h2 {
    color: ${props => props.theme.colorTitle};
    font-size: 16px;
    font-weight: 500;
  }

  p {
    color: ${props => props.theme.colorText};
    font-size: 14px;
    font-weight: 400;
    margin-top: 8px;
  }
`;

const EventControls = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;

  button, a {
    align-items: center;
    display: flex;
    justify-content: center;
    text-decoration: none;
  }
`;
