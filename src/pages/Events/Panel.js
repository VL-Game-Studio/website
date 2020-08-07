import React, { memo } from 'react';
import classNames from 'classnames';
import { Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Hero from 'pages/Hero';
import { useEventData } from 'hooks';
import './Panel.css';

const Panel = ({
  alternate,
  label = 'Active Events',
  title = 'New Tournaments Every Day',
  altText = 'There aren\'t any active events right now.',
  events,
  ...rest
}) => {
  const { isAuthorized } = useEventData();

  return (
    <Hero
      className={classNames('panel', { 'panel--alternate': alternate })}
      label={!alternate && label}
      title2={title}
      {...rest}
    >
      <div className={classNames('panel__tournaments', { 'panel__tournaments--alternate': alternate })}>
        {events === false && <Paragraph>An error occured while fetching events.</Paragraph>}
        {(!events && events !== false) && <Paragraph>Loading events..</Paragraph>}
        {events?.length === 0 && <Paragraph>{altText}</Paragraph>}
        {events?.length > 0 && events?.map(({ id, name, description }) => (
          <Link
            className="panel__tournament"
            key={id}
            to={`/events/${id}`}
            aria-label={name}
          >
            <h4 className="panel__tournament-name">
              <span>{name}</span>
              <div></div>
            </h4>
            <p className="panel__tournament-info">
              {description.substring(0, 200)}{description.length > 200 && '...'}
            </p>
            <Icon icon="plus" />
          </Link>
        ))}
        {isAuthorized && <Button as={Link} to="/events/create" label="Create Event" />}
      </div>
      {!alternate && <Button as={Link} to="/events" label="All Events" />}
    </Hero>
  );
};

export default memo(Panel);
