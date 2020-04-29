import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title } from 'components/Type';
import Button from 'components/Button';
import { Link } from 'components/Link';
import { reflow } from 'utils/transition';
import events from 'data/events';

export default function Events(props) {
  const { id, sectionRef, visible = true, ...rest } = props;
  const labelId = `${id}-label`

  return (
    <EventsWrapper
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
                {events.map(({ id, date, time, name, description }) => {
                  const [month, day] = date.split(' ');
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
                          <p>{description}</p>
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
    </EventsWrapper>
  );
}

const EventsWrapper = styled.section`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const EventsContent = styled.div`
  display: grid;
  grid-gap: 142px;
  grid-template-columns: 280px 652px;
  margin: 91px 118px;

  @media (max-width: ${props => props.theme.laptop}px) {
    grid-gap: 0;
    grid-row-gap: 32px;
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventsList = styled(Column)`
  background: ${props => props.theme.colorBackgroundLight};
  padding: 40px 60px;
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
