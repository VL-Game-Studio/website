import React, { useState, useEffect, Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Post from './Post';
import BlogList from './BlogList';
import NotFound from 'pages/NotFound';
import { useScrollRestore } from 'hooks';
import prerender from 'utils/prerender';

function Blog() {
  const [articles, setArticles] = useState([]);
  useScrollRestore();

  useEffect(() => {
    async function getArticles() {
      try {
        const response = await fetch('/functions/articles', {
          method: 'GET',
          mode: 'cors',
        });
        if (response.status !== 200) return false;

        const data = await response.json();

        return data && setArticles(Object.values(data));
      } catch (error) {
        return console.error(error.message);
      }
    }

    if (!prerender) getArticles();
  }, []);

  return (
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
  );
}

export default Blog;
