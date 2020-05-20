import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import { AnimFade, rgba } from 'utils/style';
import { reflow } from 'utils/transition';
import { socials, navLinks } from 'data/nav';

function Footer(props) {
  const { sectionRef, visible = true, ...rest } = props;

  return (
    <FooterWrapper
      ref={sectionRef}
      {...rest}
    >
      <Transition
        in={visible}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <FooterContent status={status}>
            <FooterLeft>
              <Link
                to={{ pathname: '/', hash: '#intro' }}
                aria-label="Project Modern, Putting Players First"
              >
                <Icon icon="logo" />
              </Link>
              <Paragraph>Putting players first.</Paragraph>
              <h4>&copy; {new Date().getFullYear()} Project Modern</h4>
              <FooterSocials>
                {socials?.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer noopener"
                    href={href}
                  >
                    <Icon icon={icon} />
                  </a>
                ))}
              </FooterSocials>
            </FooterLeft>
            <FooterRight>
              <FooterLabel>We Can Help</FooterLabel>
              <FooterLinks>
                <Anchor href="mailto:support@projectmodern.gg">support@projectmodern.gg</Anchor>
                <Anchor href="https://discord.gg/mjtTnr8" target="_blank">discord.gg/mjtTnr8</Anchor>
              </FooterLinks>
              <FooterLabel>Sitemap</FooterLabel>
              <FooterMenu>
                {navLinks?.map(({ to, label }) => (
                  <Link
                    key={label}
                    aria-label={label}
                    to={to}
                  >
                    {label}
                  </Link>
                ))}
              </FooterMenu>
            </FooterRight>
          </FooterContent>
        )}
      </Transition>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  align-items: center;
  background: ${props => props.theme.colorBackgroundDarkSecondary};
  display: flex;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr auto;
  margin: 150px auto;
  max-width: 1200px;
  opacity: 0;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    grid-gap: 0;
    grid-row-gap: 85px;
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  ${props => props.status === 'entering' && css`
    animation: ${css`${AnimFade} 0.6s ease 0.2s forwards`};
  `}

  ${props => props.status === 'entered' && css`
    opacity: 1;
  `}
`;

const FooterLeft = styled.div`
  position: relative;

  a, ${Paragraph} {
    color: ${props => props.theme.colorWhite};
  }

  ${Paragraph} {
    margin-top: 30px;
  }

  h4 {
    color: ${props => rgba(props.theme.colorWhite, 0.4)};
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.8px;
    line-height: 32px;
    margin: 15px 0 30px;
  }
`;

const FooterSocials = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  position: absolute;

  a {
    color: ${props => rgba(props.theme.colorWhite, 0.6)};
    margin-left: 36px;

    :first-of-type {
      margin-left: 0;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    position: relative;
  }
`;

const FooterRight = styled.div`
  display: grid;
  flex-direction: column;
`;

const FooterLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2.1px;
  line-height: 28px;
  margin: 85px 0 30px;
  text-transform: uppercase;

  :first-of-type {
    margin-top: 0;
  }
`;

const FooterLinks = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;

  ${Anchor} {
    margin-top: 12px;

    :first-of-type {
      margin-top: 0;
    }
  }
`;

const FooterMenu = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: row;

  a {
    color: ${props => rgba(props.theme.colorWhite, 0.6)};
    font-size: 16px;
    letter-spacing: 0.8px;
    line-height: 32px;
    margin-left: 15px;
    text-decoration: none;

    :first-of-type {
      margin-left: 0;
    }
  }
`;

export default Footer;
