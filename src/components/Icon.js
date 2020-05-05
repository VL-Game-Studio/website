import React from 'react';
import { ReactComponent as IconLogo } from 'assets/icons/logo.svg';
import { ReactComponent as IconDiscord } from 'assets/icons/discord.svg';
import { ReactComponent as IconGithub } from 'assets/icons/github.svg';
import { ReactComponent as IconReddit } from 'assets/icons/reddit.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';

const icons = {
  logo: IconLogo,
  discord: IconDiscord,
  github: IconGithub,
  reddit: IconReddit,
  chevron: IconChevron,
};

const Icon = ({ icon, style, className }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden style={style} className={className} />
  );
};

export default Icon;
