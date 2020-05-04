import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import React, { Fragment } from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/app/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import WhitneyBook from 'assets/fonts/whitney-book.woff2';
import WhitneyMedium from 'assets/fonts/whitney-medium.woff2';
import WhitneySemiBold from 'assets/fonts/whitney-semibold.woff2';
import WhitneyBold from 'assets/fonts/whitney-bold.woff2';
import { fontStyles, GlobalStyles } from '../src/app';

addParameters({
  options: {
    theme: {
      ...theme,
      brandImage: 'https://videre.live/icon.svg',
      brandTitle: 'VidereMTG Components',
      brandUrl: 'https://videre.live',
    },
  },
});

const themeKeys = {
  'Light': 'light',
  'Dark': 'dark',
};

addDecorator(story => {
  const content = story();
  const themeKey = select('Theme', themeKeys, 'light');
  const currentTheme = theme[themeKey];

  return (
    <HelmetProvider>
      <ThemeProvider theme={currentTheme}>
        <Fragment>
          <Helmet>
            <link rel="preload" href={WhitneyBook} as="font" crossorigin="" />
            <link rel="preload" href={WhitneyMedium} as="font" crossorigin="" />
            <link rel="preload" href={WhitneySemiBold} as="font" crossorigin="" />
            <link rel="preload" href={WhitneyBold} as="font" crossorigin="" />
            <style>{fontStyles}</style>
          </Helmet>
          <GlobalStyles />
          <div id="storyRoot" key={themeKey}>{content}</div>
        </Fragment>
      </ThemeProvider>
    </HelmetProvider>
  )
});

addDecorator(withKnobs);
addDecorator(withA11y);

configure(require.context('../src', true, /\.stories\.js$/), module);
