import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { msToNum, tokens } from 'app/theme';
import { MDXProvider } from '@mdx-js/react';
import { Transition } from 'react-transition-group';
import { Helmet } from 'react-helmet-async';
import { Title, Title2, Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import { AnimFade, media } from 'utils/style';
import { useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function ArticleWrapper({
  children,
  title,
  date,
  description,
  readTime,
  ...rest
}) {
  useScrollRestore();

  return (
    <Fragment>
      <Helmet
        title={`Blog | ${title}`}
        meta={[{
          name: "description",
          content: description,
        }]}
      />
      <ArticleArticle {...rest}>
        <ArticleHeader>
          <ArticleHeaderText>
            <Transition
              appear
              in={!prerender}
              timeout={msToNum(tokens.base.durationM)}
              onEnter={reflow}
            >
              {status => (
                <ArticleDate>
                  <ArticleDateText status={status}>
                    {new Date(date).toLocaleDateString('default', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </ArticleDateText>
                </ArticleDate>
              )}
            </Transition>
            <Title aria-label={title}>
              {title.split(' ').map((word, index) => (
                <ArticleTitleWordWrapper key={`${word}-${index}`}>
                  <ArticleTitleWord index={index}>
                    {word}
                    {index !== title.split(' ').length - 1 ? '\u00a0' : ''}
                  </ArticleTitleWord>
                </ArticleTitleWordWrapper>
              ))}
            </Title>
          </ArticleHeaderText>
        </ArticleHeader>
        <ArticleContentWrapper id="ArticleContent">
          <ArticleContent>{!prerender && children}</ArticleContent>
        </ArticleContentWrapper>
      </ArticleArticle>
    </Fragment>
  );
}

const ArticleArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ArticleHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space7XL) 0;

  @media (max-width: ${media.mobile}px), ${props => props.theme.mobileLS} {
    height: auto;
    padding-right: var(--spaceL);
    padding-left: var(--spaceL);
  }
`;

const ArticleHeaderText = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: var(--maxWidthM);
`;

const ArticleDate = styled.div`
  font-size: 1.125rem;
  font-weight: var(--fontWeightMedium);
  margin-bottom: var(--space3XL);
  color: rgb(var(--rgbAccent));
  display: grid;
  grid-template-columns: var(--space6XL) 1fr;
  grid-gap: var(--spaceL);
  align-items: center;

  @media (max-width: ${media.tablet}px) {
    margin-bottom: var(--spaceXL);
    grid-gap: var(--spaceS);
  }

  @media (max-width: ${media.mobile}px) {
    grid-template-columns: var(--space4XL) 1fr;
  }
`;

const ArticleDateText = styled.span`
  opacity: ${props => (props.status === 'entered' ? 1 : 0)};
  transform: ${props => (props.status === 'entered' ? 'none' : 'translate3d(-5%, 0, 0)')};
  transition: opacity var(--durationXL) ease, transform var(--durationXL) var(--ease1);
`;

const AnimArticleTitleWord = keyframes`
  from {
    transform: translate3d(0, 110%, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
`;

const ArticleTitleWordWrapper = styled.span`
  overflow: hidden;
  position: relative;
  display: inline-flex;
`;

const ArticleTitleWord = styled.span`
  transform: translate3d(0, 110%, 0);
  animation-name: ${AnimArticleTitleWord};
  animation-timing-function: var(--ease1);
  animation-duration: 1.2s;
  animation-delay: ${props => props.index * 120 + 200}ms;
  animation-fill-mode: forwards;
  display: inline-flex;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`;

const ArticleContentWrapper = styled.div`
  animation-delay: 1.2s;
  animation-duration: var(--durationXL);
  animation-fill-mode: forwards;
  animation-name: ${AnimFade};
  animation-timing-function: var(--ease1);
  background: rgb(var(--rgbBackgroundSecondary));
  display: flex;
  flex-direction: column;
  opacity: 0;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
  }
`;

const ArticleContent = styled.div`
  width: 100%;
  align-self: center;
  margin: var(--space3XL) 0;
  display: grid;
  grid-template-columns: 1fr var(--space4XL) 800px var(--space4XL) 1fr;

  ${Title2}, ${Paragraph} {
    grid-column: 3;
  }

  ${Title2} {
    font-size: 1.5rem;
  }

  ul, li {
    grid-column: 3;
  }

  ul {
    padding: var(--spaceXL) var(--spaceL);
  }

  li {
    color: inherit;
    font-size: var(--fontSizeBody);
    font-weight: var(--fontWeightLight);
    letter-spacing: var(--letterSpacingBody);
    line-height: var(--lineHeightBody);
    margin-top: var(--spaceM);

    :first-of-type {
      margin-top: 0;
    }
  }

  ${Paragraph} + ${Title2}, ${Title2} + ${Paragraph} {
    margin-top: var(--spaceXL);
  }

  ${Paragraph} + ${Paragraph} {
    margin-top: var(--spaceL);
  }

  & > pre {
    grid-column: 3;
  }

  @media (max-width: 1320px) {
    grid-template-columns: 1fr var(--space4XL) 740px var(--space4XL) 1fr;
    margin: var(--space3XL) 0;
  }

  @media (max-width: ${media.laptop}px) {
    grid-template-columns: 1fr var(--space3XL) 680px var(--space3XL) 1fr;
    margin: var(--space2XL) 0;
  }

  @media (max-width: 1096px) {
    grid-template-columns: 1fr var(--space2XL) 660px var(--space2XL) 1fr;
    margin: var(--spaceXL) 0;
  }

  @media (max-width: ${media.tablet}px) {
    grid-template-columns: 100%;
    padding: 0 var(--spaceL);

    & > pre {
      grid-column: 1;
    }

    ${Title2}, ${Paragraph} {
      grid-column: 1;
    }

    ul, li {
      grid-column: 1;
    }
  }

  @media (max-width: ${media.mobile}px) {
    margin: var(--spaceL) 0;
    padding-bottom: var(--space4XL);

    ${Paragraph} + ${Title2}, ${Title2} + ${Paragraph} {
      margin-top: var(--spaceL);
    }

    ${Paragraph} + ${Paragraph} {
      margin-top: var(--spaceL);
    }
  }
`;

const Image = styled.img`
  display: block;
  margin: var(--space4XL) 0;
  max-width: 100%;
  width: 100%;
  height: auto;
  grid-column: 2 / span 3;

  @media (max-width: ${media.tablet}px) {
    grid-column: 1;
    margin: var(--space3XL) 0;
  }
`;

function imageFactory({ src, ...props }) {
  if (!src.startsWith('http')) {
    return <Image {...props} src={require(`articles/assets/${src}`)} />;
  }

  return <Image {...props} src={src} />;
}

const components = {
  wrapper: ArticleWrapper,
  h2: Title2,
  p: Paragraph,
  img: imageFactory,
  a: ({ href, ...props }) => href.startsWith('http')
    ? <Anchor href={href} target="_blank" rel="noreferrer noopener" {...props} />
    : <Anchor as={Link} to={href} {...props} />,
};

function Article({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

export default Article;
