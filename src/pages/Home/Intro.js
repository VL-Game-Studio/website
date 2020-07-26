import React, { memo } from 'react';
import Hero from 'pages/Hero';
import { useAppContext } from 'hooks';
import config from 'config';
import './Intro.css';

function Intro(props) {
  const { dispatch } = useAppContext();
  const onClick = () => dispatch({ type: 'setRedirect', value: 'https://discord.gg/mjtTnr8' });

  return (
    <Hero
      className="intro"
      dark
      label="Project Modern"
      title="A community-run format that puts players first"
      paragraph="Project Modern is a community-backed MTG format that prioritizes players over profits."
      button={{
        href: config.authURL,
        label: 'Get Started',
        onClick,
      }}
      {...props}
    />
  );
}

export default memo(Intro);
