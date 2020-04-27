import React, {Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { useScrollRestore } from 'hooks';

export default function Home() {
  useScrollRestore();

  return (
    <Fragment>
      <Helmet
        title="Videre - pre-WAR Modern"
        meta={[{
          name: "description",
          content: "pre-WAR Modern",
        }]}
      />
    </Fragment>
  );
}
