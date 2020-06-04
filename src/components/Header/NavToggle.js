import React from 'react';
import styled, { css } from 'styled-components/macro';
import { useAppContext } from 'hooks';

function NavToggle(props) {
  const { dark, menuOpen, ...rest } = props;
  const { dispatch } = useAppContext();

  const onClick = () => dispatch({ type: 'toggleMenu' });

  return (
    <NavToggleButton
      dark={dark}
      menuOpen={menuOpen}
      onClick={onClick}
      {...rest}
    >
      <Line />
    </NavToggleButton>
  );
}

const Line = styled.div``;

const NavToggleButton = styled.button`
  align-items: center;
  background: rgb(${props => props.dark
    ? 'var(--rgbWhite)'
    : 'var(--rgbText)'});
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 40px;
  justify-content: center;
  outline: 0;
  position: relative;
  width: 40px;

  ${Line}, ::before, ::after {
    background: rgb(${props => props.dark
      ? 'var(--rgbText)'
      : 'var(--rgbWhite)'});
    height: 1px;
    margin-left: 5px;
    margin-top: 4px;
    transition: all 0.45s var(--ease1);
    width: 12px;
  }

  ::before {
    margin-top: 0;
  }

  ::before, ::after {
    content: '';
    margin-left: 0;
    width: 17px;
  }

  :hover, :active, :focus {
    ${Line} {
      margin-left: 0;
      width: 17px;
    }
  }

  ${props => props.menuOpen && css`
    ${Line} {
      opacity: 0;
      pointer-events: none;
    }

    ::before, ::after {
      left: 12px;
      margin: 0;
      position: absolute;
      top: 20px;
    }

    ::before {
      transform: rotate(45deg);
    }

    ::after {
      transform: rotate(-45deg);
    }
  `}
`;

export default NavToggle;
