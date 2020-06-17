import React, { memo } from 'react';
import styled, { css } from 'styled-components/macro';
import Hero from 'pages/Hero';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import Button from 'components/Button';

const About = ({ alternate, ...rest }) => (
  <AboutHero
    label="Our Mission"
    title2="Building a stable, community Modern"
    alternate={alternate}
    {...rest}
  >
    <Paragraph>Ever since WAR dropped it's become increasingly clear that many Modern players have questions about the direction of current game design. Modern has stopped being a non rotating format in light of the power creep that's gone on since 2019.</Paragraph>
    <Paragraph>Project Modern is a community-run constructed format with the card pool that was the Modern preceding WAR (<Anchor href="https://docs.google.com/document/d/13r8DzulHtOSYT7aIxY8YLkmB0NdoaZZTjgZrYAIauaY" target="_blank">see complete ban list</Anchor>) with bans centered around data-driven community feedback. Our focus is cultivating a environment with a diversity of archetypes and play patterns while maintaining balance.</Paragraph>
    {!alternate && <Button to="/format" label="Learn More" />}
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
