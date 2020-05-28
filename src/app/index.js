import React, { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider, css } from 'styled-components/macro';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, TransitionGroup, config as transitionConfig } from 'react-transition-group';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocalStorage, usePrefersReducedMotion } from 'hooks';
import { initialState, reducer } from 'app/reducer';
import { theme } from 'app/theme';
import { reflow } from 'utils/transition';
import montserratLight from 'assets/fonts/montserrat-light.woff2';
import montserratRegular from 'assets/fonts/montserrat-regular.woff2';
import montserratMedium from 'assets/fonts/montserrat-medium.woff2';
import montserratSemiBold from 'assets/fonts/montserrat-semibold.woff2';
import montserratBold from 'assets/fonts/montserrat-bold.woff2';

const Home = lazy(() => import('pages/Home'));
const Events = lazy(() => import('pages/Events'));
const Auth = lazy(() => import('pages/Auth'));
//const Blog = lazy(() => import('pages/Blog'));
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
    dispatch({ type: 'setUser', value: storedUser });
  }, [storedUser]);

  useEffect(() => {
    dispatch({ type: 'setRedirect', value: storedRedirect });
  }, [storedRedirect]);

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
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
          timeout={300}
          onEnter={reflow}
        >
          {status => (
            <TransitionContext.Provider value={{ status }}>
              <AppPage status={status}>
                <Suspense fallback={<Fragment />}>
                  <Switch location={location}>
                    <Route exact path="/" component={Home} />
                    <Route path="/events" component={Events} />
                    <Route path="/auth" component={Auth} />
                    {/* <Route blog="/blog" component={Blog} /> */}
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
  html,
  body {
    box-sizing: border-box;
    font-family: ${props => props.theme.fontStack};
    font-weight: 400;
    background: ${props => props.theme.colorBackground};
    color: ${props => props.theme.colorText};
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
    background: ${props => props.theme.colorAccent};
    color: ${props => props.theme.colorWhite}
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
  background: ${props => props.theme.colorBackground};
  display: grid;
  grid-template-columns: 100%;
  outline: none;
  overflow-x: hidden;
  position: relative;
  transition: background 0.4s ease;
  width: 100%;
`;

const AppPage = styled.div`
  grid-column: 1;
  grid-row: 1;
  opacity: 0;
  overflow-x: hidden;
  transition: opacity 0.3s ease;

  ${props => (props.status === 'exiting' || props.status === 'entering') && css`
    opacity: 0;
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
    transition-delay: 0.2s;
    transition-duration: 0.5s;
  `}
`;

const SkipToMain = styled.a`
  border: 0;
  clip: rect(0 0 0 0);
  color: ${props => props.theme.colorBackground};
  height: 1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  z-index: 99;

  &:focus {
    background: ${props => props.theme.colorPrimary};
    clip-path: ${props => props.theme.clipPath(8)};
    clip: auto;
    font-weight: 500;
    height: auto;
    left: 16px;
    line-height: 1;
    padding: 8px 16px;
    position: fixed;
    text-decoration: none;
    top: 16px;
    width: auto;
  }
`;

export default App;
