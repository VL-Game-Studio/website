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
  padding: 180px 0;

  @media (max-width: ${media.mobile}px), ${props => props.theme.mobileLS} {
    height: auto;
    padding-right: 20px;
    padding-left: 20px;
  }
`;

const ArticleHeaderText = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 800px;
`;

const ArticleDate = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 60px;
  color: rgb(var(--rgbAccent));
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-gap: 20px;
  align-items: center;

  @media (max-width: ${media.tablet}px) {
    margin-bottom: 30px;
    grid-gap: 10px;
  }

  @media (max-width: ${media.mobile}px) {
    grid-template-columns: 100px 1fr;
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
  margin: 75px 0;
  display: grid;
  padding-bottom: 180px;
  grid-template-columns: 1fr 100px 800px 100px 1fr;

  ${Title2}, ${Paragraph} {
    grid-column: 3;
  }

  ${Title2} {
    font-size: 24px;
  }

  ul, li {
    grid-column: 3;
  }

  ul {
    padding: 30px 20px;
  }

  li {
    margin-top: 12px;
    font-size: 20px;
    line-height: 36px;
    letter-spacing: 0.03em;
    font-weight: 400;

    :first-of-type {
      margin-top: 0;
    }
  }

  ${Paragraph} + ${Title2}, ${Title2} + ${Paragraph} {
    margin-top: 30px;
  }

  ${Paragraph} + ${Paragraph} {
    margin-top: 20px;
  }

  & > pre {
    grid-column: 3;
  }

  @media (max-width: 1320px) {
    grid-template-columns: 1fr 80px 740px 80px 1fr;
    margin: 60px 0;
  }

  @media (max-width: ${media.laptop}px) {
    grid-template-columns: 1fr 60px 680px 60px 1fr;
    margin: 50px 0;
  }

  @media (max-width: 1096px) {
    grid-template-columns: 1fr 50px 660px 50px 1fr;
    margin: 30px 0;
  }

  @media (max-width: ${media.tablet}px) {
    grid-template-columns: 100%;
    padding: 0 20px;

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
    margin: 20px 0;
    padding-bottom: 96px;

    ${Title2} {
      font-size: 18px;
    }

    ${Paragraph} + ${Title2}, ${Title2} + ${Paragraph} {
      margin-top: 20px;
    }

    ${Paragraph} + ${Paragraph} {
      margin-top: 20px;
    }

    li {
      font-size: 16px;
    }
  }
`;

const Image = styled.img`
  display: block;
  margin: 80px 0;
  max-width: 100%;
  width: 100%;
  height: auto;
  grid-column: 2 / span 3;

  @media (max-width: ${media.tablet}px) {
    grid-column: 1;
    margin: 60px 0;
  }
`;

const components = {
  wrapper: ArticleWrapper,
  h2: Title2,
  p: Paragraph,
  img: props => <Image {...props} />,
  a: ({ href, ...props }) => href.startsWith('http')
    ? <Anchor href={href} target="_blank" rel="noreferrer noopener" {...props} />
    : <Anchor as={Link} to={href} {...props} />,
};

function Article({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

export default Article;
