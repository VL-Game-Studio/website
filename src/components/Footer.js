import React from 'react';
import styled from 'styled-components/macro';
import Anchor from 'components/Anchor';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import { rgba } from 'utils/style';
import logo from 'assets/logo.png';

const IconLink = ({ href, icon, label }) => (
  <Anchor href={href} aria-label={label}>
    <Icon icon={icon} />
    {label}
  </Anchor>
);

function Footer() {

  return (
    <FooterWrapper>
      <Logo to="/#intro" aria-label="VidereMTG">
        <img src={logo} alt="VidereMTG" />
        VidereMTG
      </Logo>
      <Links>
        <IconLink href="https://github.com/videremtg" icon="github" label="Github" />
        <IconLink href="https://discord.gg/mjtTnr8" icon="discord" label="Discord" />
        <IconLink href="https://www.reddit.com/r/CommunityModern" icon="reddit" label="Reddit" />
        <Link to="/#about" aria-label="About">About</Link>
        <Link to="/#events" aria-label="Events">Events</Link>
        <Link to="/#community" aria-label="Communty">Community</Link>
      </Links>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  background: ${props => props.theme.colorBackgroundLight};
  border-top: 1px solid ${props => rgba(props.theme.colorBlack, 0.1)};
  display: grid;
  grid-gap: 48px;
  grid-template-columns: 1fr 1fr;
  padding: 51px 40px;
  width: 100%;

  svg {
    margin-right: 8px;
  }

  a, svg {
    color: ${props => props.theme.colorText};
    text-decoration: none!important;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    grid-gap: 0;
    grid-template-columns: 1fr;
  }
`;

const Logo = styled(Link)`
  align-items: center;
  display: grid;
  font-weight: 500;
  grid-gap: 8px;
  grid-template-columns: 32px 1fr;
  justify-content: center;

  img {
    width: 100%;
  }
`;

const Links = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  a {
    font-size: 14px;
    font-weight: 500;
    padding: 0 24px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

export default Footer;
