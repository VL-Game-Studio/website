import React, { Fragment, Suspense } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import Timeline from 'components/Timeline';
import { Title } from 'components/Type';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

export default function Intro(props) {
  const { id, sectionRef, ...rest } = props;
  const titleId = `${id}-title`

  return (
    <IntroWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
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
              <IntroTitle id={titleId} aria-label=""></IntroTitle>
            </IntroContent>
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

const IntroTitle = styled(Title)`
  color: ${props => props.theme.colorWhite};
`;

const IntroContent = styled.div``;
