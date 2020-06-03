import React from 'react';
import styled, { css } from 'styled-components/macro';
import TextArea from './TextArea';

const Input = ({ textarea, ...rest }) => textarea
  ? <TextAreaWrapper {...rest} />
  : <InputWrapper {...rest} />;

const inputStyles = css`
  background:
    linear-gradient(${props => props.theme.colorBackgroundDarkSecondary}, ${props => props.theme.colorBackgroundDarkSecondary}) no-repeat 100% 100% / 0 1px,
    linear-gradient(#bcbcbc, #bcbcbc) no-repeat 0 100% / 100% 1px;
  border: none!important;
  box-shadow: none!important;
  font-family: inherit;
  font-size: 100%;
  height: 70px;
  line-height: 1.15;
  margin: 0;
  padding: 26px 0;
  transition: background-size 0.4s ${props => props.theme.ease1};
  width: 100%;

  &:focus {
    background:
      linear-gradient(${props => props.theme.colorBackgroundDarkSecondary}, ${props => props.theme.colorBackgroundDarkSecondary}) no-repeat 0 100% / 100% 1px,
      linear-gradient(#bcbcbc, #bcbcbc) no-repeat 0 100% / 100% 1px;
    outline: none;
  }
`;

const InputWrapper = styled.input`
  ${inputStyles}
`;

const TextAreaWrapper = styled(TextArea)`
  ${inputStyles}
  height: 140px;
  margin-bottom: 20px;
`;

export default Input;
