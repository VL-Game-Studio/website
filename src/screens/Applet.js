import React, { useState, Suspense, Fragment } from 'react';
import styled from 'styled-components/macro';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Icon from 'components/Icon';
import { Link, NavLink } from 'components/Link';
import { Transition } from 'react-transition-group';
import { useScrollRestore } from 'hooks';
import { rgba } from 'utils/style';
import { appLinks } from 'data/nav';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

export default function Applet() {
  const location = useLocation();
  const [hashKey, setHashKey] = useState();
  useScrollRestore();

  const handleNavClick = () => {
    setHashKey(Math.random().toString(32).substr(2, 8));
  };

  const isMatch = ({ match, hash = '' }) => {
    return match && `${match.url}${hash}` === `${location.pathname}${location.hash}`;
  };

  return (
    <AppletWrapper>
      <AppletNav>
        <Logo to="/" aria-label="VidereMTG">
          <Icon icon="logo" />
        </Logo>
        {appLinks.map(({ title, links }) => links.map(({ label, pathname = '', hash }) => (
          <Fragment>
            {title && <label aria-label={title}>{title}</label>}
            <AppletNavLink
              exact
              isActive={match => isMatch({ match, hash })}
              onClick={handleNavClick}
              key={label}
              to={{ pathname: `/app${pathname}`, hash, state: hashKey }}
            >
              {label}
            </AppletNavLink>
          </Fragment>
        )))}
      </AppletNav>
      <Transition
        appear={!prerender}
        in={!prerender}
        timeout={3000}
        onEnter={reflow}
      >
        {status => (
          <AppletContent status={status}>
            <Suspense fallback={<Fragment />}>
              <Switch>
                {appLinks.map(({ links }) => links.map(({ content: Screen, pathname, ...rest }, index) => (
                  <Route
                    key={index}
                    exact={!pathname}
                    path={`/app${pathname || ''}`}
                    component={Screen}
                    {...rest}
                  />
                )))}
                <Redirect to="/app/events" />
              </Switch>
            </Suspense>
          </AppletContent>
        )}
      </Transition>
    </AppletWrapper>
  );
}

const AppletWrapper = styled.div`
  display: grid;
  grid-gap: 75px;
  grid-template-columns: 154px 1fr;
  min-height: 100vh;
  padding: 100px 120px;
  position: relative;
  width: 100vw;
`;

const AppletNav = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;

  label {
    color: ${props => rgba(props.theme.colorTitle, 0.4)};
    font-size: 12px;
    font-weight: 500;
    margin: 28px 0 3px;
    text-transform: uppercase;
  }
`;

const Logo = styled(Link)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-bottom: 55px;

  &, svg {
    color: ${props => props.theme.colorAccent};
    height: 21px;
    width: 150px;
  }
`;

const AppletNavLink = styled(NavLink)`
  color: ${props => rgba(props.theme.colorTitle, 0.6)};
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  padding: 4px 0;
  text-decoration: none;
  transition: color 0.3s;

  &:hover,
  &:active,
  &:focus,
  &.active {
    color: ${props => props.theme.colorAccent};
  }
`;

const AppletContent = styled.div`

`;
