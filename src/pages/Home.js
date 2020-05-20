import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useTheme } from 'styled-components/macro';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Intro from 'pages/Intro';
import About from 'pages/About';
import Events from 'pages/Events';
import GetStarted from 'pages/GetStarted';
import Footer from 'components/Footer';
import { useAppContext, usePrefersReducedMotion, useRouteTransition } from 'hooks';

export default function Home(props) {
  const { status } = useRouteTransition();
  const { dispatch } = useAppContext();
  const theme = useTheme();
  const themeRef = useRef(theme);
  const { hash, state } = useLocation();
  const initHash = useRef(true);
  const [visibleSections, setVisibleSections] = useState([]);
  const intro = useRef();
  const about = useRef();
  const events = useRef();
  const getStarted = useRef();
  const footer = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (status === 'entered' || status === 'exiting') {
      dispatch({
        type: 'updateTheme',
        value: { themeId: 'dark' },
      });
    }

    return function cleanUp() {
      if (status !== 'entered') {
        dispatch({ type: 'updateTheme' });
      }
    };
  }, [dispatch, status]);

  useEffect(() => {
    const revealSections = [intro, about, events, getStarted, footer];

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
      <Helmet
        title="Project Modern - Putting Players First"
        meta={[{
          name: "description",
          content: "Project Modern is a community-backed MTG format that prioritizes players over profits.",
        }]}
      />
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
      <Footer
        sectionRef={footer}
        visible={visibleSections.includes(footer.current)}
      />
    </Fragment>
  );
}
