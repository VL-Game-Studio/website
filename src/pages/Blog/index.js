import React, { Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageLayout from 'components/PageLayout';
import Post from './Post';
import BlogList from './BlogList';
import NotFound from 'pages/NotFound';
import { useScrollRestore } from 'hooks';
import articles from 'articles';

function Blog() {
  useScrollRestore();

  return (
    <PageLayout>
      <Post>
        <Suspense fallback={Fragment}>
          <Switch>
            {articles?.map(({ content: Article, path, ...rest }) => (
              <Route
                key={path}
                path={`/blog${path}`}
                render={() => <Article {...rest} />}
              />
            ))}
            <Route
              exact
              path="/blog"
              render={() => <BlogList articles={articles} />}
            />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Post>
    </PageLayout>
  );
}

export default Blog;
