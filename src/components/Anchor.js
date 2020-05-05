import React from 'react';
import styled, { css } from 'styled-components/macro';
import Icon from 'components/Icon';

function Anchor(props) {
  const { withArrow, children, ...rest } = props;

  return (
    <AnchorElem {...rest}>
      {children}
      {withArrow && <Icon icon="chevron" />}
    </AnchorElem>
  );
}

const AnchorElem = styled.a.attrs(({ target }) => ({
  rel: target === '_blank' ? 'noreferrer nofollower' : null
}))`
  color: rgb(30, 167, 253);
  display: inline-block;
  font-size: 16px;
  line-height: 1.5;
  text-decoration: none;
  transition: transform 150ms ease-out 0s, color 150ms ease-out 0s;

  ${props => props.withArrow && css`
    svg {
      bottom: -0.125em;
      display: inline-block;
      height: 1em;
      margin-right: 0.4em;
      position: relative;
      vertical-align: text-top;
      width: 1em;
    }

    & > svg:last-of-type {
      bottom: auto;
      height: 0.7em;
      margin-left: 0.25em;
      margin-right: 0px;
      vertical-align: inherit;
      width: 0.7em;
    }
  `}

  &:hover,
  &:focus {
    color: rgb(2, 151, 245);
    cursor: pointer;
  }
`;

export default Anchor;
