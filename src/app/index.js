import React, { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider, css } from 'styled-components/macro';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, TransitionGroup, config as transitionConfig } from 'react-transition-group';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocalStorage, usePrefersReducedMotion } from 'hooks';
import { initialState, reducer } from 'app/reducer';
import { tokens, createThemeProperties, msToNum } from 'app/theme';
import { media } from 'utils/style';
import { reflow } from 'utils/transition';
import montserratLight from 'assets/fonts/montserrat-light.woff2';
import montserratRegular from 'assets/fonts/montserrat-regular.woff2';
import montserratMedium from 'assets/fonts/montserrat-medium.woff2';
import montserratSemiBold from 'assets/fonts/montserrat-semibold.woff2';
import montserratBold from 'assets/fonts/montserrat-bold.woff2';

const Home = lazy(() => import('pages/Home'));
const Format = lazy(() => import('pages/Format'));
const Events = lazy(() => import('pages/Events'));
const Blog = lazy(() => import('pages/Blog'));
const Auth = lazy(() => import('pages/Auth'));
//const Decks = lazy(() => import('pages/Decks'));
const NotFound = lazy(() => import('pages/NotFound'));

export const AppContext = createContext();
export const TransitionContext = createContext();

export const fontStyles = `
  @font-face {
    font-family: 'Montserrat';
    font-weight: 300;
    src: url(${montserratLight}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 400;
    src: url(${montserratRegular}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 500;
    src: url(${montserratMedium}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 600;
    src: url(${montserratSemiBold}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 700;
    src: url(${montserratBold}) format('woff2');
    font-display: swap;
  }
`;

function App() {
  const [storedEvents] = useLocalStorage('events', null);
  const [storedUser] = useLocalStorage('user', null);
  const [storedRedirect] = useLocalStorage('redirect', null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { menuOpen } = state;

  useEffect(() => {
    if (prefersReducedMotion) {
      transitionConfig.disabled = true;
    } else {
      transitionConfig.disabled = false;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    dispatch({ type: 'setEvents', value: storedEvents });
  }, [storedEvents]);

  useEffect(() => {
    dispatch({ type: 'setUser', value: storedUser });
  }, [storedUser]);

  useEffect(() => {
    dispatch({ type: 'setRedirect', value: storedRedirect });
  }, [storedRedirect]);

  return (
    <HelmetProvider>
      <ThemeProvider theme={tokens}>
        <AppContext.Provider value={{ ...state, dispatch }}>
          <BrowserRouter>
            <AppRoutes menuOpen={menuOpen} />
          </BrowserRouter>
        </AppContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function AppRoutes({ menuOpen }) {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Fragment>
      <Helmet>
        <link rel="canonical" href={`https://projectmodern.gg${pathname}`} />
        <link rel="preload" href={montserratLight} as="font" crossorigin="" />
        <link rel="preload" href={montserratRegular} as="font" crossorigin="" />
        <link rel="preload" href={montserratMedium} as="font" crossorigin="" />
        <link rel="preload" href={montserratSemiBold} as="font" crossorigin="" />
        <link rel="preload" href={montserratBold} as="font" crossorigin="" />
        <style>{fontStyles}</style>
      </Helmet>
      <GlobalStyles menuOpen={menuOpen} />
      <SkipToMain href="#MainContent">Skip to main content</SkipToMain>
      <TransitionGroup
        component={AppMainContent}
        tabIndex={-1}
        id="MainContent"
        role="main"
      >
        <Transition
          key={pathname}
          timeout={msToNum(tokens.base.durationS)}
          onEnter={reflow}
        >
          {status => (
            <TransitionContext.Provider value={{ status }}>
              <AppPage status={status}>
                <Suspense fallback={<Fragment />}>
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/format" component={Format} />
                    <Route path="/events" component={Events} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/auth" component={Auth} />
                    {/* <Route path="/decks" component={Decks} /> */}
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </AppPage>
            </TransitionContext.Provider>
          )}
        </Transition>
      </TransitionGroup>
    </Fragment>
  );
}

export const GlobalStyles = createGlobalStyle`
  :root {
    ${createThemeProperties(tokens.base)}

    @media (max-width: ${media.laptop}px) {
      ${createThemeProperties(tokens.laptop)}
    }

    @media (max-width: ${media.tablet}px) {
      ${createThemeProperties(tokens.tablet)}
    }

    @media (max-width: ${media.mobile}px) {
      ${createThemeProperties(tokens.mobile)}
    }
  }

  html,
  body {
    box-sizing: border-box;
    font-family: var(--fontStack);
    font-weight: var(--fontWeightRegular);
    background: rgb(var(--rgbBackground));
    color: var(--colorTextBody);
    border: 0;
    margin: 0;
    width: 100vw;
    overflow-x: hidden;

    ${props => props.menuOpen && css`
      overflow: hidden;
    `}
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  ::selection {
    background: rgb(var(--rgbAccent));
    color: rgb(var(--rgbWhite));
  }

  #root *,
  #root *::before,
  #root *::after {
    @media (prefers-reduced-motion: reduce) {
      animation-delay: 0s;
      animation-duration: 0s;
      transition-delay: 0s;
      transition-duration: 0s;
    }
  }
`;

const AppMainContent = styled.main`
  background: rgb(var(--rgbBackground));
  display: grid;
  grid-template-columns: 100%;
  outline: none;
  overflow-x: hidden;
  position: relative;
  transition: background var(--durationM) ease;
  width: 100%;
`;

const AppPage = styled.div`
  grid-column: 1;
  grid-row: 1;
  opacity: 0;
  overflow-x: hidden;
  transition: opacity var(--durationS) ease;

  ${props => (props.status === 'exiting' || props.status === 'entering') && css`
    opacity: 0;
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
    transition-delay: var(--durationXS);
    transition-duration: var(--durationL);
  `}
`;

const SkipToMain = styled.a`
  background: rgb(var(--rgbPrimary));
  border: 0;
  clip: rect(0 0 0 0);
  color: rgb(var(--rgbBackground));
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  z-index: 99;

  &:focus {
    clip: auto;
    font-weight: var(--fontWeightMedium);
    height: auto;
    left: var(--spaceM);
    line-height: 1;
    padding: var(--spaceS) var(--spaceM);
    position: fixed;
    text-decoration: none;
    top: var(--spaceM);
    width: auto;
  }
`;

export default App;
