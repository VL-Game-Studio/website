import React from 'react';
import styled from 'styled-components/macro';
import Anchor from './Anchor';

function Header (props) {

  return (
    <HeaderWrapper>
      <h1>Videre - Pre-WAR Modern</h1>
      <div>
        <Anchor target="_blank" href="https://discord.gg/mjtTnr8">Discord Server</Anchor>
        <Anchor as="button">Appearance</Anchor>
      </div>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 100%;
  max-width: 1440px;
  padding: 0px 8px 8px;

  h1 {
    color: ${props => props.theme.colorText};
    font-family: ${props => props.theme.fontStack};
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
  }

  div {
    display: flex;
    flex-direction: row;
  }
`;

export default Header;
