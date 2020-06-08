import React, { useCallback, useEffect, memo, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { useAppContext, useScrollRestore } from 'hooks';
import config from 'config';

function AllDecks(props) {
  const { user, dispatch } = useAppContext();
  useScrollRestore();

  const handleRedirect = useCallback(() => {
    dispatch({ type: 'setRedirect', value: '/decks' });
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      handleRedirect();
      window.location = config.authURL;
    }
  }, [user, handleRedirect]);

  return (
    <Fragment>
      <Helmet
        title="Decks - Project Modern"
      />
      <PageLayout>
        <Hero
          label="Decks"
          title="Your Decklists"
        />
      </PageLayout>
    </Fragment>
  );
}

export default memo(AllDecks);
