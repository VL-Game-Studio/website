import React, { Fragment, memo } from 'react';
import styled, { css } from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import { Transition } from 'react-transition-group';
import PageLayout from 'components/PageLayout';
import { Label, Title, Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import ProgressiveImage from 'components/ProgressiveImage';
import { AnimFade } from 'utils/style';
import { useScrollRestore } from 'hooks';
import { reflow } from 'utils/transition';
import prerender from 'utils/prerender';

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
      <PageLayout>
        <BlogListWrapper>
          <Transition
            appear={!prerender}
            in={!prerender}
            timeout={3000}
            onEnter={reflow}
          >
            {status => (
              <BlogListContainer status={status}>
                <BlogListContent>
                  <Label>Blog</Label>
                  <Title>Recent News and Updates</Title>
                </BlogListContent>
              </BlogListContainer>
            )}
          </Transition>
        </BlogListWrapper>
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
              <Link key={path} to={path}>
                {(banner || bannerVideo) &&
                  <ProgressiveImage
                    srcSet={banner}
                    videoSrc={bannerVideo}
                    placeholder={bannerPlaceholder}
                    alt={bannerAlt}
                  />
                }
                <Label>
                  {new Date(date).toLocaleDateString('default', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </Label>
                <Title2>{title}</Title2>
                <Paragraph>{description}</Paragraph>
              </Link>
            ))}
          </ArticlesGrid>
        }
      </PageLayout>
    </Fragment>
  );
}

const BlogListWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackground};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const BlogListContainer = styled.div`
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

const BlogListContent = styled.div`
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

  @media (max-width: ${props => props.theme.laptop}px) {
    ${Title} {
      width: 70%;
    }
  }

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-left: 35px;

    ${Label} {
      left: -35px;
    }

    ${Title} {
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
  }
`;

const ArticlesGrid = styled.div`
  background: ${props => props.theme.colorBackgroundSecondary};
  display: grid;
  grid-column-gap: 6.666%;
  grid-row-gap: 160px;
  grid-template-columns: auto auto;
  padding-bottom: 215px;
  width: 100%;

  @media (max-width: ${props => props.theme.mobile}px) {
    display: block;
    padding-bottom: 60px;
    padding-top: 41px;
    transform: translate3d(-20px, 0, 0);
    width: calc(100% + 40px);
  }
`;

export default memo(BlogList);
