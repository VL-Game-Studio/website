/* eslint-disable import/no-webpack-loader-syntax */
import { lazy } from 'react';
import { frontMatter as juneFirstFrontMatter } from '!babel-loader!mdx-loader!articles/juneFirst.mdx';
const JuneFirst = lazy(() => import('!babel-loader!mdx-loader!articles/juneFirst.mdx'));

const articles = [
  {
    content: JuneFirst,
    ...juneFirstFrontMatter,
  }
];

export default articles;
