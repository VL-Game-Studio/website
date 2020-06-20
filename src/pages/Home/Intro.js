import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Hero from 'pages/Hero';
import { Title, Paragraph } from 'components/Type';
import { useAppContext } from 'hooks';
import { media } from 'utils/style';
import config from 'config';

function Intro(props) {
  const { dispatch } = useAppContext();
  const onClick = () => dispatch({ type: 'setRedirect', value: 'https://discord.gg/mjtTnr8' });

  return (
    <IntroHero
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

const IntroHero = styled(Hero)`
  min-height: 100vh;

  ${Title}, ${Paragraph} {
    width: auto;
  }

  ${Title} {
    margin-top: 45px;
    max-width: 658px;
  }

  ${Paragraph} {
    margin-top: 20px;
    max-width: 530px;
  }

  @media (max-width: ${media.mobile}px) {
    ${Title}, ${Paragraph} {
      max-width: none;
    }
  }
`;

export default memo(Intro);
