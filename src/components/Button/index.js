import React, { Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';
import { rgba } from 'utils/style';

const ButtonContent = ({ label, icon = 'arrowRight', ...rest }) => (
  <ButtonWrapper aria-label={label} {...rest}>
    <span>{label}</span>
    {icon && <Icon icon={icon} />}
  </ButtonWrapper>
);

function Button(props) {
  const { href, to, ...rest } = props;

  return (
    <Fragment>
      {(!href && !to) && <ButtonContent {...rest} />}
      {href &&
        <AnchorLink href={href}>
          <ButtonContent {...rest} />
        </AnchorLink>
      }
      {to &&
        <Link to={to} style={{ textDecoration: 'none' }}>
          <ButtonContent {...rest} />
        </Link>
      }
    </Fragment>
  );
}

const linkStyles = css`
  color: ${props => props.accent || props.dark
    ? props.theme.colorWhite
    : props.theme.colorTitle};
  font-family: ${props => props.theme.fontStack};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.25em;
  line-height: 24px;
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
`;

const AnchorLink = styled.a.attrs({
  target: '_blank',
  rel: 'noreferrer noopener',
})`
  ${linkStyles}
`;

const ButtonWrapper = styled.button`
  align-items: center;
  background: none;
  border-style: none;
  cursor: pointer;
  display: flex;
  height: 48px;
  outline: 0;
  padding: 0 24px;

  &, span {
    ${linkStyles}
  }

  span, svg {
    z-index: 2;
  }

  svg {
    display: inline-block;
    margin-left: 28px;
    opacity: 0.7;
    position: relative;
    transition: margin 0.5s ${props => props.theme.ease1};
  }

  ::before {
    background: ${props => props.dark
      ? '#323135'
      : rgba(props.theme.colorBlack, 0.05)};
    border-radius: 24px;
    content: '';
    display: block;
    height: 48px;
    left: 0;
    position: absolute;
    top: 0;
    transition: width 0.45s ${props => props.theme.ease1};
    width: 48px;
    z-index: 1;

    ${props => props.accent && css`
      background: ${props => rgba(props.theme.colorWhite, 0.2)};
    `}
  }

  :focus, :hover, :active {
    ::before {
      width: 100%;
    }

    svg {
      margin-left: 36px;
    }
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 14px;
  }
`;

export default Button;
