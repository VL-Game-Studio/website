import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Button from 'components/Button';
import { Link } from 'components/Link';
import events from 'data/events';

export default function Events() {

  return (
    <Fragment>
      <Helmet
        title="Events - VidereMTG"
      />
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
    </Fragment>
  );
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventsList = styled(Column)`
  background: ${props => props.theme.colorBackgroundLight};
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
  max-width: 700px;

  :first-of-type {
    margin-top: 0;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    grid-gap: 24px;
    grid-row-gap: 24px;
    grid-template-columns: 1fr;
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

  @media (max-width: ${props => props.theme.laptop}px) {
    flex-direction: column;

    ${Column} {
      margin-left: 0;
    }
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

  @media (max-width: ${props => props.theme.laptop}px) {
    justify-content: flex-start;

    button, a {
      margin-left: 0;
    }
  }
`;
