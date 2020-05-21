import React from 'react';
import styled from 'styled-components/macro';
import Icon from 'components/Icon';
import { rgba } from 'utils/style'
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
    color: ${props => rgba(props.dark ? props.theme.colorWhite : props.theme.colorTitle, 0.6)}!important;
    margin-left: 36px;
    transition: color 0.4s ${props => props.theme.ease1};

    :first-of-type {
      margin-left: 0;
    }

    :hover, :focus, :active {
      color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorTitle}!important;
    }
  }
`;

export default Socials;
