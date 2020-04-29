import React, { useRef, Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import Intro from './Intro';
import About from './About';
import Events from './Events';
import Community from './Community';
import Footer from 'components/Footer';
import { useScrollRestore } from 'hooks';

export default function Home() {
  const intro = useRef();
  const about = useRef();
  const events = useRef();
  const community = useRef();
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
      <Intro
        id="intro"
        sectionRef={intro}
      />
      <About
        id="about"
        sectionRef={about}
      />
      <Events
        id="events"
        sectionRef={events}
      />
      <Community
        id="community"
        sectionRef={community}
      />
      <Footer />
    </Fragment>
  );
}
