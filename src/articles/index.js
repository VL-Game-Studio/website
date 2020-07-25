const allArticles = require.context(
  '!babel-loader!mdx-loader!articles',
  true,
  /\.mdx$/,
  'lazy'
);

const articles = allArticles.keys().map(async filePath => {
  const module = await allArticles(filePath);

  return {
    content: module.default,
    ...module.frontMatter,
  };
});

export default articles;
