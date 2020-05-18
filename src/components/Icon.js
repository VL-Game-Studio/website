import React from 'react';
import { ReactComponent as IconLogo } from 'assets/icons/logo.svg';
import { ReactComponent as IconArrowRight } from 'assets/icons/arrow-right.svg';

const icons = {
  logo: IconLogo,
  arrowRight: IconArrowRight,
};

const Icon = ({ icon, style, className }) => {
  const IconComponent = icons[icon];

  return (
    <IconComponent aria-hidden style={style} className={className} />
  );
};

export default Icon;
