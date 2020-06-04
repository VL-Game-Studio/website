import React, { Fragment, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title, Title2, Paragraph } from 'components/Type';
import Button from 'components/Button';
import { useScrollRestore } from 'hooks';
import { AnimFade, media } from 'utils/style';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function Hero({
  children,
  dark,
  accent,
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
      accent={accent}
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
  background: rgb(${props => props.dark
    ? 'var(--rgbBackgroundDark)'
    : 'var(--rgbBackground)'});
  display: flex;
  padding: 0 var(--space2XL);

  @media (max-width: ${media.mobile}px) {
    padding: 0 var(--spaceL);
  }

  ${props => props.accent && css`
    background: rgb(var(--rgbAccent));

    ${Label}, ${Title}, ${Title2}, ${Paragraph} {
      color: rgb(var(--rgbWhite));
    }
  `}
`;

const HeroContainer = styled.div`
  margin: 0 auto;
  max-width: var(--maxWidthXL);
  opacity: 0;
  width: 100%;

  @media (max-width: ${media.desktop}px) {
    max-width: var(--maxWidthL);
  }

  @media (max-width: ${media.laptop}px) {
    max-width: var(--maxWidthM);
  }

  @media (max-width: ${media.mobile}px) {
    max-width: var(-maxWidthS);
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} var(--durationL) ease var(--durationXS) forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const HeroContent = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin: var(--space7XL) 0;
  padding-left: var(--space2XL);

  ${Label} {
    left: -var(--space2XL);
    position: relative;
  }

  ${Title} {
    margin-top: var(--space2XL);
    width: 56%;
  }

  ${Title2} {
    margin-top: var(--space2XL);
    width: 56%;
  }

  ${Paragraph} {
    margin-top: var(--spaceXL);
    width: 70%;
  }

  ${Title} + ${Paragraph} {
    margin-top: var(--spaceL);
  }

  ${Title2} + ${Paragraph} {
    letter-spacing: 0;
    margin-top: var(--space3XL);
  }

  a {
    margin-top: var(--space3XL);
  }

  @media (max-width: ${media.laptop}px) {
    ${Title}, ${Title2} {
      width: 70%;
    }

    ${Paragraph} {
      width: 80%;
    }
  }

  @media (max-width: ${media.tablet}px) {
    padding-left: var(--spaceXL);

    ${Label} {
      left: -var(--spaceXL);
    }

    ${Title}, ${Title2}, ${Paragraph} {
      width: 100%;
    }
  }

  @media (max-width: ${media.mobile}px) {
    margin: var(--space4XL) 0;
    padding-left: 0;

    ${Label} {
      left: 0;
    }

    ${Title} {
      margin-top: var(--spaceXL);
    }

    ${Title2}, ${Paragraph} {
      &, :first-of-type {
        margin-top: var(--spaceL);
      }
    }

    a {
      margin-top: var(--space2XL);
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
      margin-left: -var(--space2XL);
    }

    @media (max-width: ${media.tablet}px) {
      ${Label} {
        margin-left: -var(--spaceXL);
      }
    }

    @media (max-width: ${media.mobile}px) {
      ${Label} {
        margin-left: 0;
      }
    }
  `}
`;

export default memo(Hero);
