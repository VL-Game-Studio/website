import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import NavToggle from 'components/NavToggle';
import { useAppContext } from 'hooks';

function Header() {
  const { menuOpen, dispatch } = useAppContext();

  const handleMobileNavClick = () => {
    if (menuOpen) dispatch({ type: 'toggleMenu' });
  };

  const handleMenuToggle = () => {
    dispatch({ type: 'toggleMenu' });
  };

  return (
    <HeaderWrapper role="banner">
      <HeaderLogo
        to={{ pathname: '/', hash: '#intro' }}
        aria-label="VidereMTG"
        onClick={handleMobileNavClick}
      >
        <Icon icon="logo" />
      </HeaderLogo>
      <NavToggle onClick={handleMenuToggle} />
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  left: 40px;
  position: fixed;
  right: 40px;
  top: 40px;
  z-index: 1024;
`;

const HeaderLogo = styled(Link)`
  color: ${props => props.theme.colorAccent}!important;
  display: flex;
  padding: 10px;
  position: relative;
  z-index: 16;
`;

export default memo(Header);
