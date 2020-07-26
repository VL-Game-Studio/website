import React from 'react';
import TextArea from './TextArea';
import './index.css';

const Input = ({ textarea, ...rest }) => textarea
  ? <TextArea className="input input--textarea" {...rest} />
  : <Input className="input" {...rest} />;

export default Input;
