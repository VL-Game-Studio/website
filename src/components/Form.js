import React from 'react';
import styled, { css } from 'styled-components/macro';
import Anchor from 'components/Anchor';

function Form (props) {
  const { header, children, ...rest } = props;

  return (
    <FormWrapper>
      <FormContent {...rest}>
        {header && <FormHeader>{header}</FormHeader>}
        {children}
      </FormContent>
    </FormWrapper>
  );
}

const FormWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin: 0 auto;
  max-width: 800px;
  width: 100%;

  h1, ${Anchor} {
    color: ${props => props.theme.colorText};
    font-family: ${props => props.theme.fontStack};
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
  }
`;

const FormHeader = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 8px 8px;
`;

const FormContent = styled.form`
  display: flex;
  flex-direction: column;

  ${props => props.secondary && css`
    background: rgb(47, 49, 54) none repeat scroll 0% 0%;
    border-radius: 4px;
    box-shadow: rgba(4, 4, 5, 0.2) 0px 1px 0px,
                rgba(6, 6, 7, 0.05) 0px 1.5px 0px,
                rgba(4, 4, 5, 0.05) 0px 2px 0px;
    margin: 8px;
    padding: 8px;
  `}
`;

export default Form;
