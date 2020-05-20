import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';

function Header(props) {

  return (
    <HeaderWrapper role="banner">
      <LogoLink
        to={{ pathname: '/', hash: '#intro' }}
        aria-label="Project Modern, Putting Players First"
      >
        <Icon icon="logo" />
      </LogoLink>
      <HeaderNav>
        <CTALink href="https://discord.gg/mjtTnr8" target="_blank" rel="noreferrer noopener">Get Started</CTALink>
        <Hamburger>
          <Line />
          <Line />
          <Line />
        </Hamburger>
      </HeaderNav>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  align-items: center;
  display: flex;
  height: 150px;
  justify-content: space-between;
  left: 0;
  margin: 0 auto;
  max-width: calc(100% - 100px);
  pointer-events: none;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.55s ${props => props.theme.ease1};
  z-index: 1024;

  &, a {
    color: ${props => props.theme.colorWhite};
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    height: 116px;
    max-width: calc(100% - 40px);
  }
`;

const LogoLink = styled(Link)`
  pointer-events: all;
`;

const HeaderNav = styled.nav`
  align-items: center;
  display: flex;
  pointer-events: all;
`;

const CTALink = styled.a`
  color: ${props => props.theme.colorWhite};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.15em;
  line-height: 28px;
  margin-right: 30px;
  text-decoration: none;
  text-transform: uppercase;

  ::after {
    background: ${props => props.theme.colorWhite};
    content: '';
    display: block;
    height: 1px;
    margin-top: 5px;
    transform-origin: left;
    transform: scaleX(1);
    transition: transform 0.4s ${props => props.theme.ease1};
    width: 100%;
  }

  &:hover,
  &:focus {
    ::after {
      transform-origin: right;
      transform: scaleX(0);
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    line-height: 24px;
  }
`;

const Line = styled.div`
  background: ${props => props.theme.colorTitle};
  height: 1px;
  margin-left: 5px;
  margin-top: 4px;
  transition: all 0.45s ${props => props.theme.ease1};
  width: 12px;

  :first-of-type {
    margin-top: 0;
  }

  :first-of-type, :last-of-type {
    margin-left: 0;
    width: 17px;
  }
`;

const Hamburger = styled.button`
  align-items: center;
  background: ${props => props.theme.colorWhite};
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

  :hover, :active, :focus {
    ${Line}:nth-child(2) {
      margin-left: 0;
      width: 17px;
    }
  }
`;

export default memo(Header);
