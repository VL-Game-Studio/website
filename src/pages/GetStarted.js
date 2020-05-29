import React, { memo } from 'react';
import Hero from 'pages/Hero';

const GetStarted = ({ accent, ...rest }) => (
  <Hero
    center
    accent={accent}
    label="Get Started"
    title2="Ready to Play?"
    button={{
      accent,
      href: "https://discord.gg/mjtTnr8",
      target: '_blank',
      label: 'Get Started',
    }}
    {...rest}
  />
);

export default memo(GetStarted);
