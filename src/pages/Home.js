import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from 'components/Header';
import Intro from 'pages/Intro';

export default function Home() {

  return (
    <Fragment>
      <Helmet
        title="Project Modern - Putting Players First"
        meta={[{
          name: "description",
          content: "Project Modern is a community-backed format that prioritizes format health over profit.",
        }]}
      />
      <Header />
      <Intro />
    </Fragment>
  );
}
