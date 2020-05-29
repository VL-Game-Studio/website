import React, { Fragment, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title, Title2, Paragraph } from 'components/Type';
import Button from 'components/Button';
import { useScrollRestore } from 'hooks';
import { AnimFade } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Hero({
  children,
  dark,
  center,
  id,
  sectionRef,
  visible = !prerender,
  label,
  title,
  title2,
  paragraph,
  button,
  ...rest
}) {
  const titleId = id && `${id}-title`;
  useScrollRestore();

  const MetaWrapper = ({ children }) => center
    ? <div>{children}</div>
    : <Fragment>{children}</Fragment>;

  return (
    <HeroWrapper
      dark={dark}
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >
      <Transition
        appear={visible}
        in={visible}
        timeout={3000}
        onEnter={reflow}
      >
        {status => (
          <HeroContainer status={status}>
            <HeroContent center={center}>
              <MetaWrapper>
                {label && <Label>{label}</Label>}
                {title && <Title id={titleId} dark={dark}>{title}</Title>}
                {title2 && <Title2 id={titleId} dark={dark}>{title2}</Title2>}
                {paragraph && <Paragraph dark={dark}>{paragraph}</Paragraph>}
              </MetaWrapper>
              {button && <Button dark={dark} {...button} />}
              {children}
            </HeroContent>
          </HeroContainer>
        )}
      </Transition>
    </HeroWrapper>
  );
}

const HeroWrapper = styled.section`
  align-items: center;
  background: ${props => props.dark
    ? props.theme.colorBackgroundDark
    : props.theme.colorBackground};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const HeroContainer = styled.div`
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

const HeroContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: 180px 0;
  padding-left: 50px;

  ${Label} {
    left: -50px;
    position: relative;
  }

  ${Title} {
    margin-top: 45px;
    width: 56%;
  }

  ${Title2} {
    margin-top: 40px;
    width: 56%;
  }

  ${Paragraph} {
    margin-top: 30px;
    width: 70%;
  }

  ${Title} + ${Paragraph} {
    margin-top: 20px;
  }

  ${Title2} + ${Paragraph} {
    letter-spacing: 0;
    margin-top: 75px;
  }

  a {
    margin-top: 60px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    ${Title}, ${Title2} {
      width: 70%;
    }

    ${Paragraph} {
      width: 80%;
    }
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }

    ${Title}, ${Title2}, ${Paragraph} {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 96px 0;
    padding-left: 0;

    ${Label} {
      left: 0;
    }

    ${Title} {
      margin-top: 33px;
    }

    ${Title2}, ${Paragraph} {
      margin-top: 20px;
    }

    a {
      margin-top: 45px;
    }
  }

  ${props => props.center && css`
    align-items: center;
    padding: 0;

    ${Title}, ${Title2}, ${Paragraph} {
      max-width: none;
      width: auto;
    }

    ${Label} {
      left: 0;
      margin-left: -50px;
    }

    @media (max-width: ${props => props.theme.tablet}px) {
      ${Label} {
        margin-left: -35px;
      }
    }

    @media (max-width: ${props => props.theme.mobile}px) {
      ${Label} {
        margin-left: 0;
      }
    }
  `}
`;

export default memo(Hero);
