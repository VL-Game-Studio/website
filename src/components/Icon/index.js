import React from 'react';
import { ReactComponent as Logo } from 'assets/icons/logo.svg';
import { ReactComponent as ArrowRight } from 'assets/icons/arrow-right.svg';
import { ReactComponent as Discord } from 'assets/icons/discord.svg';
import { ReactComponent as Reddit } from 'assets/icons/reddit.svg';
import { ReactComponent as Twitter } from 'assets/icons/twitter.svg';
import { ReactComponent as Github } from 'assets/icons/github.svg';
import { ReactComponent as Plus } from 'assets/icons/plus.svg';

const icons = {
  logo: Logo,
  arrowRight: ArrowRight,
  discord: Discord,
  reddit: Reddit,
  twitter: Twitter,
  github: Github,
  plus: Plus,
};

const Icon = ({ icon, style, className }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden style={style} className={className} />
  );
};

export default Icon;
