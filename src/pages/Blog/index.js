import React, { createContext, useState, useEffect, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageLayout from 'components/PageLayout';
import Article from './Article';
import BlogList from './BlogList';
import NotFound from 'pages/NotFound';
import fetchArticles from 'articles';

const BlogContext = createContext({});

const Blog = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const grabArticles = async () => {
      const articleData = await Promise.all(fetchArticles);
      setArticles(articleData);
    };

    grabArticles();
  }, []);

  return (
    <PageLayout>
      <BlogContext.Provider value={{ articles }}>
        <Suspense>
          <Switch>
            {articles?.map(({ slug, ...rest }) => (
              <Route
                exact
                key={slug}
                path={`/blog/${slug}`}
                render={() => <Article slug={slug} {...rest} />}
              />
            ))}
            <Route exact render={() => <BlogList articles={articles} />} path="/blog" />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </BlogContext.Provider>
    </PageLayout>
  );
};

export default Blog;
