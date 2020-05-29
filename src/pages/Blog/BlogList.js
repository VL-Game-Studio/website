import React, { Fragment, memo } from 'react';
import styled from 'styled-components/macro';
import { Helmet } from 'react-helmet-async';
import PageLayout from 'components/PageLayout';
import Hero from 'pages/Hero';
import { Label, Title2, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import ProgressiveImage from 'components/ProgressiveImage';
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
      <PageLayout>
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
