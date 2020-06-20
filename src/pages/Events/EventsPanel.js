import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Hero from 'pages/Hero';
import { useAppContext } from 'hooks';
import { media } from 'utils/style';
import config from 'config';

function EventsPanel({
  alternate,
  label = 'Active Events',
  title = 'New Tournaments Every Day',
  altText = 'There aren\'t any active events right now.',
  events,
  ...rest
}) {
  const { user } = useAppContext();
  const authorized = config?.admins?.includes(user?.id);

  return (
    <EventsHero
      alternate={alternate}
      label={!alternate && label}
      title2={title}
      {...rest}
    >
      <Tournaments alternate={alternate}>
        {events === false && <Paragraph>An error occured while fetching events.</Paragraph>}
        {(!events && events !== false) && <Paragraph>Loading events..</Paragraph>}
        {events?.length === 0 && <Paragraph>{altText}</Paragraph>}
        {events?.length > 0 && events?.map(({ id, name, description }) => (
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
        {authorized && <Button to="/events/create" label="Create Event" />}
      </Tournaments>
      {!alternate && <Button to="/events" label="All Events" />}
    </EventsHero>
  );
}

const EventsHero = styled(Hero)`
  display: flex;
  background: rgb(var(--rgbBackgroundSecondary));

  ${Title2} {
    max-width: 564px;
    width: auto;
  }

  a.button {
    margin: var(--space3XL) auto 0;
  }

  @media (max-width: ${media.mobile}px) {
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
  grid-row-gap: var(--spaceXL);
  margin: var(--spaceL) 0 0;
  max-width: 624px;
  width: 100%;

  @media (max-width: ${media.mobile}px) {
    align-self: flex-start;
    margin-top: var(--spaceXL);
    max-width: none;
  }
`;

const TournamentName = styled.h4`
  align-self: flex-start;
  color: var(--colorTextTitle);
  flex: none;
  font-size: 1.875rem;
  font-weight: var(--fontWeightBold);
  letter-spacing: 0.02em;
  line-height: 1.5;
  position: relative;

  span {
    position: relative;
    z-index: 2;
  }

  div {
    background-color: rgb(var(--rgbBlack) / 0.067);
    bottom: 0;
    height: var(--spaceL);
    position: absolute;
    right: -20px;
    right: -var(--spaceM);
    transform-origin: right;
    transform: scaleX(0);
    transition: transform var(--durationXL) var(--ease1);
    width: 100%;
    z-index: 1;
  }

  @media (max-width: ${media.mobile}px) {
    div {
      display: none;
    }
  }
`;

const Tournament = styled(Link)`
  color: var(--colorTextBody);
  display: flex;
  flex-direction: column;
  height: var(--space6XL);
  justify-content: center;
  margin: 0!important;
  padding-right: var(--spaceM);
  position: relative;
  text-decoration: none;
  width: 100%;

  svg {
    color: rgb(var(--rgbAccent));
    position: absolute;
    right: 0;
    top: var(--space2XL);
  }

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

  @media (max-width: ${media.mobile}px) {
    height: 100px;

    svg {
      top: var(--spaceXL);
    }
  }
`;

const TournamentInfo = styled.p`
  font-size: var(--fontSizeH3);
  font-weight: var(--fontWeightRegular);
  letter-spacing: 0.05em;
  line-height: var(--lineHeightBody);
  margin-top: var(--spaceS);
`;

export default memo(EventsPanel);
