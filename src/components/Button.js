import React from 'react';
import styled, { css, keyframes } from 'styled-components/macro';

function Button(props) {
  const { label, children, shiny, ...rest } = props;

  return (
    <ButtonWrapper aria-label={label} {...rest}>
      {label}
      {children}
      {shiny &&
        <ShineContainer>
          <ShineGrid>
            <ShineInner></ShineInner>
          </ShineGrid>
        </ShineContainer>
      }
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.button`
  background: ${props => props.theme.colorAccent} none repeat scroll 0% 0%;
  border-radius: 3px;
  border: 1px solid rgb(114, 137, 218);
  color: ${props => props.theme.colorText};
  cursor: pointer;
  font-family: ${props => props.theme.fontStack};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 8px;
  max-height: 32px;
  min-height: 32px;
  min-width: 60px;
  outline: currentcolor none medium;
  overflow: hidden;
  padding: 2px 15px;
  position: relative;
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

  ${props => props.secondary && css`
    background: rgb(79, 84, 92);
    border: rgb(246, 246, 247);

    :hover:not(:disabled),
    :focus:not(:disabled) {
      background: rgb(114, 118, 125) none repeat scroll 0% 0%;
      border-color: rgb(246, 246, 247);
    }
  `}

  ${props => props.outline && css`
    background: transparent;
    border: none;
    text-decoration: none;

    :hover:not(:disabled),
    :focus:not(:disabled) {
      background: transparent;
      border-color: rgb(246, 246, 247);
      text-decoration: underline;
    }
  `}
`;

const Shine = keyframes`
  0% {
    translate3d(-50%, 0px, 0px);
  }
  100% {
    translate3d(200%, 0px 0px);
  }
`;

const ShineContainer = styled.div`
  animation: ${Shine} 2s ease-in-out 0.75s infinite;
  bottom: 0;
  color: hsla(0, 0%, 100%, 0.1);
  left: -50%;
  position: absolute;
  right: 0;
  top: -50%;
  user-select: none;
`;

const ShineGrid = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex: 1 1 auto;
  height: 300%;
  justify-content: center;
  outline: 0;
  position: relative;
  top: -100%;
  transform: rotate(30deg);
  width: 56px;
`;

const ShineInner = styled.div`
  background-color: currentColor;
  height: 100%;
  outline: 0;
  width: 16px;
`;

export default Button;
