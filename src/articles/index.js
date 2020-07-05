/* eslint-disable import/no-webpack-loader-syntax */
import { lazy } from 'react';
import { frontMatter as juneFirstFrontMatter } from '!babel-loader!mdx-loader!articles/juneFirst.mdx';
import { frontMatter as julyFirstFrontMatter } from '!babel-loader!mdx-loader!articles/julyFirst.mdx';

const JuneFirst = lazy(() => import('!babel-loader!mdx-loader!articles/juneFirst.mdx'));
const JulyFirst = lazy(() => import('!babel-loader!mdx-loader!articles/julyFirst.mdx'));

const articles = [
  {
    content: JuneFirst,
    ...juneFirstFrontMatter,
  },
  {
    content: JulyFirst,
    ...julyFirstFrontMatter,
  },
];

export default articles;
