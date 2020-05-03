import { lazy } from 'react';

const Events = lazy(() => import('screens/Events'));

export const appLinks = [
  {
    links: [
      {
        label: 'Events',
        pathname: '/events',
        content: Events
      },
      {
        label: 'Metagame',
        pathname: '/metagame'
      },
      {
        label: 'Decks',
        pathname: '/decks'
      }
    ]
  },
  {
    title: 'Recent',
    links: [
      {
        label: 'Event #12345',
        pathname: '/events/12345'
      }
    ]
  }
];
