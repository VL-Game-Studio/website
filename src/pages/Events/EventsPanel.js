import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Hero from 'pages/Hero';

const EventsPanel = ({
  alternate,
  label = 'Active Events',
  title = 'New Tournaments Every Day',
  altText = 'There aren\'t any active events right now.',
  events,
  ...rest
}) => (
  <EventsHero
    alternate={alternate}
    label={!alternate && label}
    title2={title}
    {...rest}
  >
    <Tournaments alternate={alternate}>
      {(!events || events.length === 0) && <Paragraph>{altText}</Paragraph>}
      {events.length > 0 && events?.map(({ id, name, description }) => (
        <Tournament
          key={id}
          to={`/events/${id}`}
          aria-label={name}
        >
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
  </EventsHero>
);

const EventsHero = styled(Hero)`
  display: flex;
  background: ${props => props.theme.colorBackgroundSecondary};

  ${Title2} {
    max-width: 564px;
    width: auto;
  }

  a {
    margin: 60px auto 0;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    ${Title2} {
      max-width: none;
    }
  }

  ${props => props.alternate && css`
    ${Title2} {
      align-self: flex-end;
      margin-top: 0;
    }
  `}
`;

const Tournaments = styled.div`
  align-self: ${props => props.alternate ? 'flex-start' : 'flex-end'};
  display: grid;
  grid-row-gap: 20px;
  margin: 20px 0 0;
  max-width: 624px;
  padding-right: 12px;
  width: 100%;

  svg {
    color: ${props => props.theme.colorAccent};
    position: absolute;
    right: 0;
    top: 50px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    align-self: flex-start;
    max-width: none;
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
  margin: 0!important;
  position: relative;
  text-decoration: none;
  width: 100%;

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

export default memo(EventsPanel);
