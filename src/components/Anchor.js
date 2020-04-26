import styled, { css } from 'styled-components/macro';

const Anchor = styled.a.attrs(({ target }) => ({
  rel: target === '_blank' ? 'noreferrer nofollower' : null
}))`
  align-items: center;
  background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
  border: medium none;
  color: ${props => props.theme.colorText};
  cursor: pointer;
  display: flex;
  font-family: ${props => props.theme.fontStack};
  font-size: 16px;
  font-weight: 500;
  justify-content: center;
  line-height: 20px;
  margin: 4px 0px 0px 16px;
  outline: currentcolor none medium;
  padding: 0px;
  text-decoration: none;
  white-space: nowrap;

  &:hover,
  &:focus {
    text-decoration: underline;
  }

  ${props => props.accent && css`
    color: ${props => props.theme.colorAccent};
  `}
`;

export default Anchor;
