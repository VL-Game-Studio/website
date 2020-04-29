import React from 'react';
import { ReactComponent as IconDiscord } from 'assets/icons/discord.svg';
import { ReactComponent as IconGithub } from 'assets/icons/github.svg';
import { ReactComponent as IconReddit } from 'assets/icons/reddit.svg';

const icons = {
  discord: IconDiscord,
  github: IconGithub,
  reddit: IconReddit,
};

const Icon = ({ icon, style, className }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden style={style} className={className} />
  );
};

export default Icon;
