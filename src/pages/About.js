import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title2, Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import { AnimFade } from 'utils/style';
import { reflow } from 'utils/transition';

function About(props) {
  const { id, sectionRef, visible, ...rest } = props;
  const titleId = `${id}-title`;

  return (
    <AboutWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition
        in={visible}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <AboutContainer status={status}>
            <AboutContent>
              <Label>Our Mission</Label>
              <Title2 id={titleId}>Building a stable, community Modern</Title2>
              <Paragraph>Ever since WAR dropped it's become increasingly clear that many Modern players have questions about the direction of current game design. Modern has stopped being a non rotating format in light of the power creep that's gone on since 2019.</Paragraph>
              <Paragraph>Project Modern is a community-run constructed format with the card pool that was the Modern preceding WAR (<Anchor href="https://docs.google.com/document/d/1-F_6Ofi286X3D_1V0W2ifajOklR58ZfCsZhGw2lvcoc/edit?usp=sharing" target="_blank">see complete ban list</Anchor>) with bans centered around data-driven community feedback. Our focus is cultivating a environment with a diversity of archetypes and play patterns while maintaining balance.</Paragraph>
            </AboutContent>
          </AboutContainer>
        )}
      </Transition>
    </AboutWrapper>
  );
}

const AboutWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackground};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const AboutContainer = styled.div`
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

const AboutContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 180px 0;
  padding-left: 50px;

  ${Label} {
    left: -50px;
    position: relative;
  }

  ${Title2} {
    margin-top: 40px;
    width: 56%;
  }

  ${Paragraph} {
    letter-spacing: 0;
    margin-top: 30px;
    width: 70%;
  }

  ${Paragraph}:first-of-type {
    margin-top: 75px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    ${Paragraph} {
      width: 80%;
    }
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }

    ${Title2}, ${Paragraph} {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px 0;
    padding-left: 0;

    ${Label} {
      left: 0;
    }
  }
`;

export default memo(About);
