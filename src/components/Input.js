import React from 'react';
import styled, { css } from 'styled-components/macro';
import TextArea from './TextArea';

const inputStyles = css`
  background: rgb(64, 68, 75) none repeat scroll 0% 0%;
  border-radius: 3px;
  border: medium none;
  color: rgb(220, 221, 222);
  font-family: inherit;
  font-size: 15px;
  line-height: 20px;
  margin: 8px 0px;
  outline: currentcolor none medium;
  padding: 6px 8px;
`;

function Input(props) {
  const { inline, aside, textarea, label, children, ...rest } = props;

  return (
    <InputWrapper inline={inline}>
      <Label aside={aside}>{label}</Label>
      {!textarea && <InputElem aria-label={label} {...rest} />}
      {textarea && <TextAreaElem aria-label={label} {...rest} />}
      {children}
    </InputWrapper>
  );
}

const InputWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  ${props => props.inline && css`
    display: flex;
    flex-direction: column;
    margin: 8px 8px 0px;
  `}
`;

const InputElem = styled.input`
  ${inputStyles}
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 2px;

  ${props => props.aside && css`
    font-size: 13px;
    font-weight: 500;
    margin: 3px 1px 0px 0px;
  `}

  ${props => props.status === 'invalid' && css`
    color: rgb(240, 71, 71);
  `}

  ${props => props.status === 'valid' && css`
    color: rgb(67, 181, 129);
  `}
`;

const TextAreaElem = styled(TextArea)`
  max-height: 40vh;
  min-height: 120px;
  resize: vertical;
  ${inputStyles}
`;

export default Input;
