import React from 'react';
import styled from 'styled-components/macro';
import Icon from 'components/Icon';
import { socials } from 'data/nav';

function Socials(props) {
  const { dark, ...rest } = props;

  return (
    <SocialsMenu dark={dark} {...rest}>
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
    </SocialsMenu>
  );
}

const SocialsMenu = styled.div`
  align-items: center;
  display: flex;

  a {
    color: rgb(var(${props => props.dark ? '--rgbWhite' : '--rgbText'}) / 0.6)!important;
    margin-left: 36px;
    transition: color 0.4s var(--ease1);

    :first-of-type {
      margin-left: 0;
    }

    :hover, :focus, :active {
      color: rgb(var(${props => props.dark ? '--rgbWhite' : '--rgbText'}))!important;
    }
  }
`;

export default Socials;
