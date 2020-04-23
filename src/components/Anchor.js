import styled from 'styled-components/macro';

const Anchor = styled.a.attrs(({ target }) => ({
  rel: target === '_blank' ? 'noreferrer nofollower' : null
}))`
  align-items: center;
  background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;
  border: medium none;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  justify-content: center;
  margin: 4px 0px 0px 16px;
  outline: currentcolor none medium;
  padding: 0px;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

export default Anchor;
