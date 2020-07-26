import { configure, addParameters, addDecorator } from '@storybook/react';
import React, { Fragment } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { tokens } from '../src/app/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { fontStyles, globalStyles } from '../src/app';
import montserratLight from 'assets/fonts/montserrat-light.woff2';
import montserratRegular from 'assets/fonts/montserrat-regular.woff2';
import montserratMedium from 'assets/fonts/montserrat-medium.woff2';
import montserratSemiBold from 'assets/fonts/montserrat-semibold.woff2';
import montserratBold from 'assets/fonts/montserrat-bold.woff2';

addParameters({
  options: {
    theme: {
      ...tokens,
      brandImage: 'https://projectmodern.gg/icon.svg',
      brandTitle: 'Project Modern Components',
      brandUrl: 'https://projectmodern.gg',
    },
  },
});

addDecorator(story => {
  const content = story();

  return (
    <HelmetProvider>
      <Fragment>
        <Helmet>
          <link rel="preload" href={montserratLight} as="font" crossorigin="" />
          <link rel="preload" href={montserratRegular} as="font" crossorigin="" />
          <link rel="preload" href={montserratMedium} as="font" crossorigin="" />
          <link rel="preload" href={montserratSemiBold} as="font" crossorigin="" />
          <link rel="preload" href={montserratBold} as="font" crossorigin="" />
          <style>{fontStyles}</style>
          <style>{globalStyles}</style>
        </Helmet>
        <div id="storyRoot">{content}</div>
      </Fragment>
    </HelmetProvider>
  )
});

addDecorator(withKnobs);
addDecorator(withA11y);

configure(require.context('../src', true, /\.stories\.js$/), module);
