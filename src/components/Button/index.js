import React from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import './index.css';

const Button = ({
  as: Component = 'button',
  href,
  rel,
  target,
  className,
  disabled,
  dark,
  accent,
  label,
  icon = 'arrowRight',
  ...rest
}) => (
  <Component
    disabled={disabled}
    href={href}
    rel={rel || (target === '_blank' ? 'noopener noreferrer' : null)}
    target={target}
    className={classNames('button', className, {
      'button--disabled': disabled,
      'button--dark': dark,
      'button--accent': accent
    })}
    aria-label={label}
    {...rest}
  >
    <span>{label}</span>
    {icon && <Icon icon={icon} />}
  </Component>
);

export default Button;
