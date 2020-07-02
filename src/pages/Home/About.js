import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import Hero from 'pages/Hero';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';

const About = (props) => (
  <AboutHero
    label="Our Mission"
    title2="Building a stable, community Modern"
    {...props}
  >
  <Paragraph>Ever since WAR dropped it's become increasingly clear that many Modern players have questions about the direction of current game design. Modern has stopped being a non-rotating format in light of the power creep that's gone on since 2019.</Paragraph>
  <Paragraph>Project Modern is a community-run constructed format with a card pool spanning from 8ED to ELD (<Anchor href="https://docs.google.com/document/d/1Ch4XkQkS-w3hs4UmCgQrJGHXi_hEfW3tqrR1yQQR0UA" target="_blank">see complete ban list</Anchor>) with format management centered around data-driven community feedback. Our focus is cultivating a environment with a diversity of archetypes and play patterns while maintaining format balance.</Paragraph>
  </AboutHero>
);

const AboutHero = styled(Hero)`
  ${Paragraph} {
    letter-spacing: 0;
  }

  ${props => props.alternate && css`
    background: rgb(var(--rgbBackgroundSecondary));
  `}
`;

export default memo(About);
