import styled from 'styled-components/macro';

const NavToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: 0;
  position: relative;

  ::before, ::after {
    background: ${props => props.color || props.theme.colorAccent};
    content: '';
    display: block;
    height: 2px;
    position: relative;
  }

  ::before {
    width: 28px;
  }

  ::after {
    margin: 8px 0 0 14px;
    width: 14px;
  }
`;

export default NavToggle;
