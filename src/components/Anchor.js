import styled from 'styled-components/macro';

const Anchor = styled.a.attrs(({ target }) => ({
  rel: target === '_blank' ? 'noreferrer nofollower' : null
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  padding: 0px;
  margin: 4px 0px 0px 16px;
  background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
  border: medium none;
  outline: currentcolor none medium;
  cursor: pointer;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export default Anchor;
