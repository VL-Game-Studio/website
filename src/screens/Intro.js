import React, { Fragment, Suspense, memo } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import Timeline from 'components/Timeline';
import { Title } from 'components/Type';
import { rgba } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Intro(props) {
  const { id, sectionRef, scrollIndicatorHidden, ...rest } = props;
  const titleId = `${id}-title`;

  return (
    <IntroWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      {...rest}
    >
      <Transition
        appear={!prerender}
        in={!prerender}
        timeout={3000}
        onEnter={reflow}
      >
        {status => (
          <Fragment>
            {!prerender &&
              <Suspense fallback={null}>
                <Timeline />
              </Suspense>
            }
            <IntroContent status={status}>
              <IntroTitle id={titleId} aria-label="2019 was a bad year for Magic">2019 was a bad year for Magic</IntroTitle>
            </IntroContent>
            <MemoizedScrollIndicator
              isHidden={scrollIndicatorHidden}
              status={status}
            />
          </Fragment>
        )}
      </Transition>
    </IntroWrapper>
  );
}

const IntroWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackgroundDark};
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100%;
`;

const IntroContent = styled.div`
  text-align: center;
  z-index: 2;
  padding: 0 40px;
`;

const IntroTitle = styled(Title)`
  color: ${props => props.theme.colorWhite};
  font-size: 58px;
  letter-spacing: 7px;
  line-height: 1.1;
  max-width: 500px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 48px;
  }
`;

const AnimScrollIndicator = keyframes`
  0% {
    transform: translate3d(-1px, 0, 0);
    opacity: 0;
  }
  20% {
    transform: translate3d(-1px, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-1px, 8px, 0);
    opacity: 0;
  }
`;

const ScrollIndicator = styled.div`
  border-radius: 20px;
  border: 2px solid ${props => rgba(props.theme.colorWhite, 0.4)};
  bottom: 64px;
  height: 38px;
  opacity: ${props => props.status === 'entered' && !props.isHidden ? 1 : 0};
  position: fixed;
  transform: translate3d(0, ${props => props.isHidden ? '20px' : 0}, 0);
  transition-duration: 0.6s;
  transition-property: opacity, transform;
  transition-timing-function: ease;
  width: 26px;

  &::before {
    animation: ${css`${AnimScrollIndicator} 2s ease infinite`};
    background: ${props => rgba(props.theme.colorWhite, 0.4)};
    border-radius: 4px;
    content: '';
    height: 7px;
    left: 50%;
    position: absolute;
    top: 6px;
    transform: translateX(-1px);
    width: 2px;
  }
`;

const MemoizedScrollIndicator = memo(ScrollIndicator);

export default memo(Intro);
