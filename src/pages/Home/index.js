import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Intro from './Intro';
import About from './About';
import Events from 'pages/Events';
import GetStarted from 'pages/GetStarted';
import { usePrefersReducedMotion, useRouteTransition } from 'hooks';

function Home(props) {
  const { status } = useRouteTransition();
  const { hash, state } = useLocation();
  const initHash = useRef(true);
  const [visibleSections, setVisibleSections] = useState([]);
  const intro = useRef();
  const about = useRef();
  const events = useRef();
  const getStarted = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const revealSections = [intro, about, events, getStarted];

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);
          if (visibleSections.includes(section)) return;
          setVisibleSections(prevSections => [...prevSections, section]);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealSections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visibleSections]);

  useEffect(() => {
    const hasEntered = status === 'entered';
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    let scrollObserver;
    let scrollTimeout;

    const handleHashchange = (hash, scroll) => {
      clearTimeout(scrollTimeout);
      const hashSections = [intro, about, events, getStarted];
      const hashString = hash.replace('#', '');
      const element = hashSections.filter(item => item.current.id === hashString)[0];
      if (!element) return;
      const behavior = scroll && !prefersReducedMotion ? 'smooth' : 'instant';
      const top = element.current.offsetTop;

      scrollObserver = new IntersectionObserver((entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          scrollTimeout = setTimeout(() => {
            element.current.focus();
          }, prefersReducedMotion ? 0 : 400);
          observer.unobserve(entry.target);
        }
      }, { rootMargin: '-20% 0px -20% 0px' });

      scrollObserver.observe(element.current);

      if (supportsNativeSmoothScroll) {
        window.scroll({
          top,
          left: 0,
          behavior,
        });
      } else {
        window.scrollTo(0, top);
      }
    };

    if (hash && initHash.current && hasEntered) {
      handleHashchange(hash, false);
      initHash.current = false;
    } else if (!hash && initHash.current && hasEntered) {
      window.scrollTo(0, 0);
      initHash.current = false;
    } else if (hasEntered) {
      handleHashchange(hash, true);
    }

    return () => {
      clearTimeout(scrollTimeout);
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
    };
  }, [hash, state, prefersReducedMotion, status]);

  return (
    <Fragment>
      <Helmet>
        <title>Project Modern - Putting Players First</title>
        <meta
          name="description"
          content="Project Modern is a community-backed MTG format that prioritizes players over profits."
        />
      </Helmet>
      <PageLayout dark>
        <Intro
          id="intro"
          sectionRef={intro}
        />
        <About
          id="about"
          sectionRef={about}
          visible={visibleSections.includes(about.current)}
        />
        <Events
          id="events"
          sectionRef={events}
          visible={visibleSections.includes(events.current)}
        />
        <GetStarted
          id="get-started"
          sectionRef={getStarted}
          visible={visibleSections.includes(getStarted.current)}
        />
      </PageLayout>
    </Fragment>
  );
}

export default Home;
