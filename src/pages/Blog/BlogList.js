import React, { Fragment, memo } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import Hero from 'pages/Hero';
import { Link } from 'components/Link';
import { Label, Title2, Paragraph } from 'components/Type';
import { media } from 'utils/style';
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
            <ArticleListItemWrapper>
              <ArticleContent to={`/blog${path}`}>
                <ArticleText>
                  <ArticleDate>
                    {new Date(date).toLocaleDateString('default', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </ArticleDate>
                  <Title2>{title}</Title2>
                  <Paragraph>{description}</Paragraph>
                </ArticleText>
              </ArticleContent>
            </ArticleListItemWrapper>
          ))}
        </ArticlesGrid>
      }
    </Fragment>
  );
}

const ArticlesGrid = styled.div`
  background: rgb(var(--rgbBackgroundSecondary));
  display: grid;
  grid-column-gap: 6.666%;
  grid-row-gap: 160px;
  grid-template-columns: 1fr 1fr;
  padding: 180px 0;
  width: 100%;

  @media (max-width: ${media.mobile}px) {
    display: block;
    padding: 96px 0;
    padding-bottom: 60px;
    padding-top: 41px;
    transform: translate3d(-20px, 0, 0);
    width: calc(100% + 40px);
  }
`;

const ArticleListItemWrapper = styled.article`
  display: flex;
  justify-content: center;
  padding: 0 60px;

  @media (max-width: ${media.mobile}px) {
    padding: 0 35px;
  }
`;

const ArticleContent = styled(Link)`
  text-decoration: none;
  transition: background-color 0.4s ease;
  width: 100%;

  p {
    margin-top: 20px;
  }

  @media (max-width: ${media.tablet}px) {
    max-width: 440px;
  }
`;

const ArticleText = styled.div`
  padding: 60px 0 0 20px;

  @media (max-width: ${media.tablet}px) {
    padding: 30px 0;
  }
`;

const ArticleDate = styled(Label)`
  display: block;
  margin-bottom: 24px;
  position: relative;
  left: -20px;

  @media (max-width: ${media.tablet}px) {
    margin-bottom: 16px;
    left: 0;
  }
`;

export default memo(BlogList);
