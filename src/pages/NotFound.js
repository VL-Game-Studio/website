import React, { useRef, useEffect, Fragment, memo } from 'react';
import styled, { useTheme, css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import { Label, Title } from 'components/Type';
import Button from 'components/Button';
import Footer from 'components/Footer';
import { AnimFade } from 'utils/style';
import { useRouteTransition, useAppContext } from 'hooks';
import { reflow } from 'utils/transition';

function NotFound(props) {
  const { status } = useRouteTransition();
  const { dispatch } = useAppContext();
  const theme = useTheme();
  const themeRef = useRef(theme);

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

  return (
    <Fragment>
      <Helmet
        title="404 Not Found - Project Modern"
      />
      <NotFoundWrapper>
        <Transition
          appear
          in={true}
          timeout={0}
          onEnter={reflow}
        >
          {status => (
            <NotFoundContainer status={status}>
              <NotFoundContent>
                <div>
                  <Label>Page Not Found</Label>
                  <Title dark>404</Title>
                </div>
                <Button dark to="/" label="Go Back" />
              </NotFoundContent>
            </NotFoundContainer>
          )}
        </Transition>
      </NotFoundWrapper>
      <Footer />
    </Fragment>
  );
}

const NotFoundWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackgroundDark};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const NotFoundContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: 100%;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const NotFoundContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 180px 0;

  ${Label} {
    position: relative;
    margin-left: -50px;
  }

  ${Title} {
    margin-top: 40px;
  }

  a {
    margin-top: 60px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 116px 0;
    padding-left: 0;

    ${Label} {
      margin: 0;
    }

    a {
      margin-top: 45px;
    }
  }
`;

export default memo(NotFound);
