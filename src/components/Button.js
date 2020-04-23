import React from 'react';
import styled from 'styled-components/macro';

function Button(props) {
  const { label, children, ...rest } = props;

  return (
    <ButtonWrapper aria-label={label} {...rest}>
      {label}
      {children}
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  background: ${props => props.theme.colorAccent} none repeat scroll 0% 0%;
  border-radius: 3px;
  border: 1px solid rgb(114, 137, 218);
  color: ${props => props.theme.colorText};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 8px;
  max-height: 32px;
  min-height: 32px;
  min-width: 60px;
  outline: currentcolor none medium;
  padding: 2px 15px;
  transition: all 167ms ease 0s;

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background: rgb(102, 123, 196) none repeat scroll 0% 0%;
    border-color: rgb(102, 123, 196);
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default Button;
