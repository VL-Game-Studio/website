import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Transition } from 'react-transition-group';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import { Paragraph } from 'components/Type';
import Anchor from 'components/Anchor';
import Socials from 'components/Socials';
import { media } from 'utils/style';
import { useWindowSize } from 'hooks';
import { reflow } from 'utils/transition';
import { navLinks } from 'data/nav';
import './index.css';

const Footer = () => {
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
    <footer className="footer" ref={footer}>
      <Transition
        in={visible}
        timeout={4000}
        onEnter={reflow}
      >
        {status => (
          <div className={classNames('footer__content', `footer__content--${status}`)}>
            {!isMobile &&
              <div className="footer__left">
                <Link
                  to={{ pathname: '/', hash: '#intro' }}
                  aria-label="Project Modern, Putting Players First"
                >
                  <Icon icon="logo" />
                </Link>
                <Paragraph>Putting players first.</Paragraph>
                <h4>&copy; {new Date().getFullYear()} Project Modern</h4>
                <Socials className="footer__socials" dark />
              </div>
            }
            <div className="footer__right">
              <label className="footer__label">We Can Help</label>
              <div className="footer__links">
                <Anchor href="mailto:support@projectmodern.gg">support@projectmodern.gg</Anchor>
                <Anchor href="https://discord.gg/mjtTnr8" target="_blank">discord.gg/mjtTnr8</Anchor>
              </div>
              <label className="footer__label">Sitemap</label>
              <ul className="footer__menu">
                {navLinks?.map(({ label, pathname, hash }) => (
                  <Link
                    key={label}
                    aria-label={label}
                    to={{ pathname, hash }}
                  >
                    {label}
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Transition>
    </footer>
  );
};

export default Footer;
