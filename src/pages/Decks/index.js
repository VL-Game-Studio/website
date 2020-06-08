import React, { lazy, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFound from 'pages/NotFound';

const AllDecks = lazy(() => import('./AllDecks'));
const Deck = () => false;
const DeckEditor = () => false;

const Decks = () => (
  <Suspense fallback={<Fragment />}>
    <Switch>
      <Route exact path="/decks" component={AllDecks} />
      <Route exact path="/decks/:deckID" component={Deck} />
      <Route exact path="/decks/edit/:deckID" component={DeckEditor} />
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);

export default Decks;
