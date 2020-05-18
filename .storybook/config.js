import { configure, addParameters, addDecorator } from '@storybook/react';
import { themes } from '@storybook/theming';
import React, { Fragment } from 'react';
import { withKnobs, select } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { ThemeProvider } from 'styled-components';
import { theme } from '../src/app/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import MontserratLight from 'assets/fonts/montserrat-light.woff2';
import MontserratRegular from 'assets/fonts/montserrat-regular.woff2';
import MontserratMedium from 'assets/fonts/montserrat-medium.woff2';
import MontserratSemiBold from 'assets/fonts/montserrat-semibold.woff2';
import MontserratBold from 'assets/fonts/montserrat-bold.woff2';
import { fontStyles, GlobalStyles } from '../src/app';

addParameters({
  options: {
    theme: {
      ...theme,
      brandImage: 'https://projectmodern.gg/icon.svg',
      brandTitle: 'Project Modern Components',
      brandUrl: 'https://projectmodern.gg',
    },
  },
});

const themeKeys = {
  'Dark': 'dark',
  'Light': 'light',
};

addDecorator(story => {
  const content = story();
  const themeKey = select('Theme', themeKeys, 'dark');
  const currentTheme = theme[themeKey];

  return (
    <HelmetProvider>
      <ThemeProvider theme={currentTheme}>
        <Fragment>
          <Helmet>
            <link rel="preload" href={MontserratLight} as="font" crossorigin="" />
            <link rel="preload" href={MontserratRegular} as="font" crossorigin="" />
            <link rel="preload" href={MontserratMedium} as="font" crossorigin="" />
            <link rel="preload" href={MontserratSemiBold} as="font" crossorigin="" />
            <link rel="preload" href={MontserratBold} as="font" crossorigin="" />
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
