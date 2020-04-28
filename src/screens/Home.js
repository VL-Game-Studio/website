import React, { Fragment, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import Timeline from 'components/Timeline';
import { useScrollRestore } from 'hooks';
import prerender from 'utils/prerender';

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
      {!prerender &&
        <Suspense fallback={null}>
          <Timeline />
        </Suspense>
      }
    </Fragment>
  );
}
