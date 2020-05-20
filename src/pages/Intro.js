import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title, Paragraph } from 'components/Type';
import Button from 'components/Button';
import { AnimFade } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Intro(props) {
  const { id, sectionRef, ...rest } = props;
  const titleId = `${id}-title`;

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
          <IntroContainer status={status}>
            <IntroContent>
              <Label>Project Modern</Label>
              <Title dark id={titleId}>A community-run format that puts players first</Title>
              <Paragraph dark>Project Modern is a community-backed MTG format that prioritizes players over profits.</Paragraph>
              <Button dark href="https://discord.gg/mjtTnr8" label="Get Started" />
            </IntroContent>
          </IntroContainer>
        )}
      </Transition>
    </IntroWrapper>
  );
}

const IntroWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackgroundDark};
  display: flex;
  min-height: 100vh;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const IntroContainer = styled.section`
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

const IntroContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 100px 0;
  padding-left: 50px;

  ${Label} {
    left: -50px;
    position: relative;
  }

  ${Title} {
    margin-top: 45px;
    max-width: 658px;
  }

  ${Paragraph} {
    margin-top: 20px;
    max-width: 530px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 0;

    ${Label} {
      left: 0;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${Title} {
      margin-top: 33px;
    }

    ${Title}, ${Paragraph} {
      max-width: none;
    }
  }
`;

export default memo(Intro);
