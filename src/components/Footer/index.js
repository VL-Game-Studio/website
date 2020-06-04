import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import Socials from 'components/Socials';
import { AnimFade, media } from 'utils/style';
import { useWindowSize } from 'hooks';
import { reflow } from 'utils/transition';
import { navLinks } from 'data/nav';

function Footer() {
  const { width } = useWindowSize();
  const isMobile = width <= media.mobile;
  const [visible, setVisible] = useState();
  const footer = useRef();

  useEffect(() => {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          observer.unobserve(section);

          return visible ? false : setVisible(true);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    sectionObserver.observe(footer.current);

    return function cleanUp() {
      sectionObserver.disconnect();
    };
  }, [visible]);

  return (
    <FooterWrapper ref={footer}>
      <Transition
        in={visible}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <FooterContent status={status}>
            {!isMobile &&
              <FooterLeft>
                <Link
                  to={{ pathname: '/', hash: '#intro' }}
                  aria-label="Project Modern, Putting Players First"
                >
                  <Icon icon="logo" />
                </Link>
                <Paragraph>Putting players first.</Paragraph>
                <h4>&copy; {new Date().getFullYear()} Project Modern</h4>
                <FooterSocials dark />
              </FooterLeft>
            }
            <FooterRight>
              <FooterLabel>We Can Help</FooterLabel>
              <FooterLinks>
                <Anchor href="mailto:support@projectmodern.gg">support@projectmodern.gg</Anchor>
                <Anchor href="https://discord.gg/mjtTnr8" target="_blank">discord.gg/mjtTnr8</Anchor>
              </FooterLinks>
              <FooterLabel>Sitemap</FooterLabel>
              <FooterMenu>
                {navLinks?.map(({ label, pathname, hash }) => (
                  <Link
                    key={label}
                    aria-label={label}
                    to={{ pathname, hash }}
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
  background: rgb(var(--rgbBackgroundDarkSecondary));
  display: flex;
  padding: 0 50px;

  @media (max-width: ${media.mobile}px) {
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

  @media (max-width: ${media.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${media.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${media.mobile}px) {
    display: block;
    max-width: 100%;
    margin: 80px 0;
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
    color: rgb(var(--rgbWhite));
  }

  ${Paragraph} {
    margin-top: 30px;
  }

  h4 {
    color: rgb(var(--rgbWhite) / 0.4);
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.8px;
    line-height: 32px;
    margin: 15px 0 30px;
  }
`;

const FooterSocials = styled(Socials)`
  bottom: 0;
  position: absolute;

  @media (max-width: ${media.mobile}px) {
    position: relative;
  }
`;

const FooterRight = styled.div`
  display: grid;
  flex-direction: column;
`;

const FooterLabel = styled.label`
  color: rgb(var(--rgbWhite));
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2.1px;
  line-height: 28px;
  margin: 85px 0 30px;
  text-transform: uppercase;

  @media (max-width: ${media.mobile}px) {
    margin: 65px 0 30px;
  }

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
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  padding: 0;

  a {
    color: rgb(var(--rgbWhite) / 0.6);
    font-size: 16px;
    letter-spacing: 0.8px;
    line-height: 32px;
    margin-left: 15px;
    text-decoration: none;
    transition: color 0.4s var(--ease1);

    :first-of-type {
      margin-left: 0;
    }

    :hover, :focus, :active {
      color: rgb(var(--rgbWhite));
    }
  }

  @media (max-width: ${media.mobile}px) {
    flex-direction: column;

    a {
      margin-left: 0;
      margin-top: 20px;

      :first-of-type {
        margin-top: 0;
      }
    }
  }
`;

export default Footer;
