import React, { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import styled, { createGlobalStyle, ThemeProvider, css } from 'styled-components/macro';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, TransitionGroup, config as transitionConfig } from 'react-transition-group';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { theme } from 'app/theme';
import { useLocalStorage, usePrefersReducedMotion } from 'hooks';
import MontserratLight from 'assets/fonts/montserrat-light.woff2';
import MontserratRegular from 'assets/fonts/montserrat-regular.woff2';
import MontserratMedium from 'assets/fonts/montserrat-medium.woff2';
import MontserratSemiBold from 'assets/fonts/montserrat-semibold.woff2';
import MontserratBold from 'assets/fonts/montserrat-bold.woff2';
import { initialState, reducer } from 'app/reducer';
import { reflow } from 'utils/transition';

const Home = lazy(() => import('pages/Home'));

export const AppContext = createContext();
export const TransitionContext = createContext();

export const fontStyles = `
  @font-face {
    font-family: 'Montserrat';
    font-weight: 300;
    src: url(${MontserratLight}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 400;
    src: url(${MontserratRegular}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 500;
    src: url(${MontserratMedium}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 600;
    src: url(${MontserratSemiBold}) format('woff2');
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    font-weight: 700;
    src: url(${MontserratBold}) format('woff2');
    font-display: swap;
  }
`;

function App() {
  const [storedTheme] = useLocalStorage('theme', 'dark');
  const [state, dispatch] = useReducer(reducer, initialState);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { currentTheme } = state;

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
    dispatch({ type: 'setTheme', value: theme[storedTheme] });
  }, [storedTheme]);

  return (
    <HelmetProvider>
      <ThemeProvider theme={currentTheme}>
        <AppContext.Provider value={{ ...state, dispatch }}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppContext.Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Fragment>
      <Helmet>
        <link rel="canonical" href={`https://videre.live${pathname}`} />
        <link rel="preload" href={MontserratLight} as="font" crossorigin="" />
        <link rel="preload" href={MontserratRegular} as="font" crossorigin="" />
        <link rel="preload" href={MontserratMedium} as="font" crossorigin="" />
        <link rel="preload" href={MontserratSemiBold} as="font" crossorigin="" />
        <link rel="preload" href={MontserratBold} as="font" crossorigin="" />
        <style>{fontStyles}</style>
      </Helmet>
      <GlobalStyles />
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
  	-moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background: ${props => props.theme.colorBackground};
    border: 0;
    box-sizing: border-box;
    color: ${props => props.theme.colorText};
    font-family: ${props => props.theme.fontStack};
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    overflow-x: hidden;
    width: 100vw;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
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

  h1, h2, h3, h4, p, label {
    margin: 0;
    padding: 0;
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
