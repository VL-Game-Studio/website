import React from 'react';
import classNames from 'classnames';
import TextArea from './TextArea';
import './index.css';

const Input = ({
  textarea,
  as: Component = textarea ? TextArea : 'input',
  className,
  children,
  ...rest
}) => (
  <Component
    className={classNames('input', className, {
      'input--textarea': textarea
    })}
    {...rest}
  >
    {children}
  </Component>
);

export default Input;
