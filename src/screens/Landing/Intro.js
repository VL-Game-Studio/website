import React, { Fragment, memo } from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import Icon from 'components/Icon';
import { Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import { rgba } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Intro(props) {
  const { id, sectionRef, scrollIndicatorHidden, ...rest } = props;
  const logoId = `${id}-logo`;

  return (
    <IntroWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={logoId}
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
            <IntroContent status={status}>
              <Logo id={logoId} />
              <Paragraph>
                2019 was a bad year for Magic. Stable, non-rotating formats were forced into a standard-like rotation season following the powerful design philosophy following War of the Spark’s release.
              </Paragraph>
              <Paragraph>
                This site uses cookies. By continuing to browse the site, you agree to our <Link to="/legal/privacy-policy">Privacy Policy</Link>.
              </Paragraph>
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
  background: ${props => props.theme.colorAccent};
  display: flex;
  height: 100vh;
  justify-content: center;
  position: relative;
  width: 100%;
  z-index: 1025;
`;

const IntroContent = styled.div`
  text-align: center;
  z-index: 2;
  padding: 0 40px;

  ${Paragraph} {
    font-weight: 400;
    margin-top: 30px;
    max-width: 800px;

    :first-of-type {
      font-size: 18px;
      line-height: 1.6;
    }

    :last-of-type {
      font-size: 14px;
    }

    &, a {
      color: ${props => props.theme.colorWhite}!important;
    }
  }
`;

const Logo = styled(Icon).attrs({
  icon: 'logo',
  ariaLabel: 'Videre MTG',
})`
  color: ${props => props.theme.colorWhite};
  height: auto;
  width: 260px;

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 160px;
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
