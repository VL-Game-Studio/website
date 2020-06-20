import React, { memo } from 'react';
import Hero from 'pages/Hero';
import { useAppContext } from 'hooks';
import config from 'config';

function GetStarted(props) {
  const { accent, ...rest } = props;
  const { dispatch } = useAppContext();
  const onClick = () => dispatch({ type: 'setRedirect', value: 'https://discord.gg/mjtTnr8' });

  return (
    <Hero
      center
      accent={accent}
      label="Get Started"
      title2="Ready to Play?"
      button={{
        accent,
        href: config.authURL,
        label: 'Get Started',
        onClick,
      }}
      {...rest}
    />
  );
}

export default memo(GetStarted);
