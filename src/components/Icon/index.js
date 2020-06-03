import React from 'react';
import { ReactComponent as IconLogo } from 'assets/icons/logo.svg';
import { ReactComponent as IconArrowRight } from 'assets/icons/arrow-right.svg';
import { ReactComponent as IconDiscord } from 'assets/icons/discord.svg';
import { ReactComponent as IconReddit } from 'assets/icons/reddit.svg';
import { ReactComponent as IconTwitter } from 'assets/icons/twitter.svg';
import { ReactComponent as IconGithub } from 'assets/icons/github.svg';
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg';

const icons = {
  logo: IconLogo,
  arrowRight: IconArrowRight,
  discord: IconDiscord,
  reddit: IconReddit,
  twitter: IconTwitter,
  github: IconGithub,
  plus: IconPlus,
};

const Icon = ({ icon, style, className }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden style={style} className={className} />
  );
};

export default Icon;
