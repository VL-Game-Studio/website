import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { useScrollRestore } from 'hooks';

function Decks() {
  useScrollRestore();

  return (
    <Fragment>
      <Helmet
        title="Decks - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Decks"
          title="Recent Decklists"
        />
      </PageLayout>
    </Fragment>
  );
}

export default Decks;
