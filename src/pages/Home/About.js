import React, { memo } from 'react';
import classNames from 'classnames';
import Hero from 'pages/Hero';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import './About.css';

const About = ({ alternate, ...rest }) => (
  <Hero
    className={classNames('about', { 'about--alternate': alternate })}
    label="Our Mission"
    title2="Building a stable, community Modern"
    {...rest}
  >
    <Paragraph>Ever since WAR dropped, it has become increasingly clear that many Modern players have questions about the direction of current game design. Modern has stopped being a non-rotating format in light of the power creep that's gone on since 2019.</Paragraph>
    <Paragraph>Project Modern is a community-run constructed format (<Anchor href="https://docs.google.com/document/d/1Ch4XkQkS-w3hs4UmCgQrJGHXi_hEfW3tqrR1yQQR0UA" target="_blank">see rules & ban list</Anchor>) with format management centered around data-driven community feedback. Our focus is cultivating a environment with a diversity of archetypes and play patterns while maintaining format balance.</Paragraph>
  </Hero>
);

export default memo(About);
