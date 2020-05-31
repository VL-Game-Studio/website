import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { MDXProvider } from '@mdx-js/react';
import { Transition } from 'react-transition-group';
import { Helmet } from 'react-helmet-async';
import { Title2, Paragraph } from 'components/Type';
import ProgressiveImage from 'components/ProgressiveImage';
import Anchor from 'components/Anchor';
import { AnimFade } from 'utils/style';
import { useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

function PostWrapper({
  children,
  title,
  date,
  description,
  banner = undefined,
  bannerVideo = undefined,
  bannerPlaceholder = undefined,
  bannerAlt = '',
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
      <PostArticle {...rest}>
        <PostHeader>
          <PostHeaderText>
            <Transition
              appear
              in={!prerender}
              timeout={400}
              onEnter={reflow}
            >
              {status => (
                <PostDate>
                  <PostDateText status={status}>
                    {new Date(date).toLocaleDateString('default', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </PostDateText>
                </PostDate>
              )}
            </Transition>
            <PostTitle aria-label={title}>
              {title.split(' ').map((word, index) => (
                <PostTitleWordWrapper key={`${word}-${index}`}>
                  <PostTitleWord index={index}>
                    {word}
                    {index !== title.split(' ').length - 1 ? '\u00a0' : ''}
                  </PostTitleWord>
                </PostTitleWordWrapper>
              ))}
            </PostTitle>
          </PostHeaderText>
          <PostBanner>
            {(banner || bannerVideo) &&
              <PostBannerImage
                reveal
                srcSet={banner ? require(`articles/assets/${banner}`) : undefined}
                videoSrc={bannerVideo ? require(`articles/assets/${bannerVideo}`) : undefined}
                placeholder={bannerPlaceholder ? require(`articles/assets/${bannerPlaceholder}`) : undefined}
                alt={bannerAlt}
              />
            }
          </PostBanner>
        </PostHeader>
        <PostContentWrapper id="postContent">
          <PostContent>{!prerender && children}</PostContent>
        </PostContentWrapper>
      </PostArticle>
    </Fragment>
  );
}

const PostArticle = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const PostHeader = styled.header`
  padding-left: 300px;
  display: grid;
  grid-template-columns: calc(50% - 40px) 1fr;
  grid-gap: 80px;
  align-items: center;
  min-height: 80vh;

  @media (max-width: 1600px) {
    padding-left: 200px;
    grid-gap: 60px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    padding-left: 180px;
    grid-gap: 40px;
    min-height: 70vh;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 160px;
    min-height: 40vh;
    grid-gap: 20px;
  }

  @media (max-height: 696px) {
    padding-left: 100px;
  }

  @media (max-width: ${props => props.theme.mobile}px), ${props => props.theme.mobileLS} {
    grid-template-columns: 100%;
    grid-gap: 20px;
    height: auto;
    padding-right: 20px;
    padding-left: 20px;
  }
`;

const PostHeaderText = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  justify-self: flex-end;
  justify-content: center;
  flex-direction: column;
  padding: 60px 0 80px;
  max-width: 800px;

  @media (max-width: ${props => props.theme.mobile}px), ${props => props.theme.mobileLS} {
    padding: 100px 0 0;
  }
`;

const PostDate = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 60px;
  color: ${props => props.theme.colorAccent};
  display: grid;
  grid-template-columns: 140px 1fr;
  grid-gap: 20px;
  align-items: center;

  @media (max-width: ${props => props.theme.tablet}px) {
    margin-bottom: 30px;
    grid-gap: 10px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    grid-template-columns: 100px 1fr;
  }
`;

const PostDateText = styled.span`
  opacity: ${props => (props.status === 'entered' ? 1 : 0)};
  transform: ${props => (props.status === 'entered' ? 'none' : 'translate3d(-5%, 0, 0)')};
  transition: opacity 0.8s ease, transform 0.8s ${props => props.theme.ease1};
`;

const PostTitle = styled.h1`
  font-size: 94px;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
  color: ${props => props.theme.colorTitle};

  @media (max-width: 1600px) {
    font-size: 80px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    font-size: 64px;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    font-size: 42px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 36px;
  }
`;

const AnimPostTitleWord = keyframes`
  from {
    transform: translate3d(0, 110%, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
`;

const PostTitleWordWrapper = styled.span`
  overflow: hidden;
  position: relative;
  display: inline-flex;
`;

const PostTitleWord = styled.span`
  transform: translate3d(0, 110%, 0);
  animation-name: ${AnimPostTitleWord};
  animation-timing-function: ${props => props.theme.ease1};
  animation-duration: 1.2s;
  animation-delay: ${props => props.index * 120 + 200}ms;
  animation-fill-mode: forwards;
  display: inline-flex;

  @media (prefers-reduced-motion: reduce) {
    transform: none;
  }
`;

const PostBanner = styled.div`
  justify-self: flex-end;
  width: 100%;
  height: 100%;
  z-index: 1024;

  @media (max-width: ${props => props.theme.mobile}px) {
    min-height: 40vh;
    z-index: 1;
  }
`;

const PostBannerImage = styled(ProgressiveImage)`
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 28px 100%, 0 calc(100% - 28px));

  img,
  video {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;

const PostContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostContent = styled.div`
  width: 100%;
  align-self: center;
  margin: 75px 0;
  animation-name: ${AnimFade};
  animation-timing-function: ${props => props.theme.ease1};
  animation-duration: 1.2s;
  animation-delay: 1s;
  animation-fill-mode: forwards;
  opacity: 0;
  display: grid;
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
  }

  ${Paragraph} + ${Paragraph} {
    margin-top: 30px;
  }

  & > pre {
    grid-column: 3;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
  }

  @media (max-width: 1320px) {
    grid-template-columns: 1fr 80px 740px 80px 1fr;
    margin: 60px 0;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    grid-template-columns: 1fr 60px 680px 60px 1fr;
    margin: 50px 0;
  }

  @media (max-width: 1096px) {
    grid-template-columns: 1fr 50px 660px 50px 1fr;
    margin: 30px 0;
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 100%;

    & > pre {
      grid-column: 1;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 20px 0;

    ${Title2} {
      font-size: 18px;
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

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-column: 1;
    margin: 60px 0;
  }
`;

const components = {
  wrapper: PostWrapper,
  h2: Title2,
  p: Paragraph,
  img: props => <Image {...props} />,
  a: props => <Anchor target="_blank" rel="noreferrer noopener" {...props} />,
};

function Post({ children }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}

export default Post;
