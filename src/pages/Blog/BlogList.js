import React, { Fragment, memo } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import { Link } from 'components/Link';
import ProgressiveImage from 'components/ProgressiveImage';
import { rgba } from 'utils/style';
import { useScrollRestore } from 'hooks';

function BlogList(props) {
  const { articles } = props;
  useScrollRestore();

  return (
    <Fragment>
      <Helmet
        title="Blog - Project Modern"
        meta={[{
          name: "description",
          content: "The official blog of the Project Modern community and format.",
        }]}
      />
      <Hero
        label="Blog"
        title="Recent News and Updates"
      />
      {articles?.length > 0 &&
        <ArticlesGrid>
          {articles?.map(({
            path,
            banner,
            bannerVideo,
            bannerPlaceholder,
            bannerAlt,
            title,
            date,
            description,
            ...rest
          }) => (
            <PostListItemWrapper>
              <PostContent to={`/blog${path}`}>
                <PostImageWrapper>
                  {(banner || bannerVideo) &&
                    <PostImage
                      srcSet={banner ? require(`articles/assets/${banner}`) : undefined}
                      videoSrc={bannerVideo ? require(`articles/assets/${bannerVideo}`) : undefined}
                      placeholder={bannerPlaceholder ? require(`articles/assets/${bannerPlaceholder}`) : undefined}
                      alt={bannerAlt}
                    />
                  }
                </PostImageWrapper>
                <PostText>
                  <PostDate>
                    {new Date(date).toLocaleDateString('default', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </PostDate>
                  <PostTitle>{title}</PostTitle>
                  <PostDescription>{description}</PostDescription>
                </PostText>
              </PostContent>
            </PostListItemWrapper>
          ))}
        </ArticlesGrid>
      }
    </Fragment>
  );
}

const ArticlesGrid = styled.div`
  background: ${props => props.theme.colorBackgroundSecondary};
  display: grid;
  grid-column-gap: 6.666%;
  grid-row-gap: 160px;
  grid-template-columns: 1fr 1fr;
  padding: 180px 0;
  width: 100%;

  @media (max-width: ${props => props.theme.mobile}px) {
    display: block;
    padding: 96px 0;
    padding-bottom: 60px;
    padding-top: 41px;
    transform: translate3d(-20px, 0, 0);
    width: calc(100% + 40px);
  }
`;

const PostListItemWrapper = styled.article`
  display: flex;
  justify-content: center;
  padding: 0 60px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 35px;
  }
`;

const PostContent = styled(Link)`
  width: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-gap: 0 40px;
  text-decoration: none;
  transition: background-color 0.4s ease;

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 100%;
    max-width: 440px;
  }
`;

const PostText = styled.div`
  grid-column: 2;
  padding: 60px 0;

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-column: 1;
    padding: 30px 0;
  }
`;

const PostDate = styled.span`
  display: block;
  margin-bottom: 8px;
  color: ${props => rgba(props.theme.colorText, 0.8)};
`;

const PostTitle = styled.h2`
  background: linear-gradient(${props => props.theme.colorText}, ${props => props.theme.colorText}) no-repeat 100% 100% / 0 2px;
  color: ${props => props.theme.colorTitle};
  display: inline;
  font-size: 36px;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
  padding-bottom: 2px;
  transition: background-size 0.4s ${props => props.theme.ease1};

  &:hover,
  &:focus {
    background: linear-gradient(var(--colorTextBody), var(--colorTextBody)) no-repeat 0 100% / 100% 2px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 30px;
  }
`;

const PostDescription = styled.p`
  color: ${props => props.theme.colorText};
  font-size: 20px;
  line-height: 1.5;
  margin: 20px 0 0;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 18px;
  }
`;

const PostImage = styled(ProgressiveImage)`
  clip-path: polygon(0 0,100% 0,100% 100%,28px 100%,0 calc(100% - 28px));
  height: 100%;

  img,
  video {
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ${props => props.theme.ease1};
    width: 100%;
  }

  ${PostContent}:hover & img,
  ${PostContent}:hover & video {
    transform: scale3d(1.1, 1.1, 1);
  }
`;

const PostImageWrapper = styled.div`
  background: rgba(255, 255, 255, 0.1);
  position: relative;
`;

export default memo(BlogList);
