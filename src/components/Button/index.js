import React, { Fragment } from 'react';
import styled, { css } from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';

const ButtonContent = ({ label, icon = 'arrowRight', ...rest }) => (
  <ButtonWrapper aria-label={label} {...rest}>
    <span>{label}</span>
    {icon && <Icon icon={icon} />}
  </ButtonWrapper>
);

function Button(props) {
  const { href, target, to, ...rest } = props;

  return (
    <Fragment>
      {(!href && !to) && <ButtonContent {...rest} />}
      {href &&
        <AnchorLink href={href} target={target}>
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
  color: rgb(${props => (props.accent && 'var(--rgbAccent)') || props.dark
    ? 'var(--rgbWhite)'
    : 'var(--rgbText)'});
  font-family: var(--fontStack);
  font-size: 0.75rem;
  font-weight: var(--fontWeightBold);
  letter-spacing: 0.25em;
  line-height: var(--spaceL);
  position: relative;
  text-decoration: none;
  text-transform: uppercase;
`;

const AnchorLink = styled.a.attrs(({ target, rel }) => ({
  rel: rel || target === '_blank' ? 'noreferrer noopener' : null,
}))`
  ${linkStyles}
`;

const ButtonWrapper = styled.button`
  align-items: center;
  background: none;
  border-style: none;
  cursor: pointer;
  display: flex;
  height: var(--space2XL);
  outline: 0;
  padding: 0 var(--spaceL);

  &, span {
    ${linkStyles}
  }

  span, svg {
    z-index: 2;
  }

  svg {
    display: inline-block;
    margin-left: calc(var(--spaceL) + 4px);
    opacity: 0.7;
    position: relative;
    transition: margin var(--durationL) var(--ease1);
  }

  ::before {
    background: ${props => props.dark
      ? '#323135'
      : 'rgb(var(--rgbBlack) / 0.05)'};
    border-radius: var(--spaceL);
    content: '';
    display: block;
    height: var(--space2XL);
    left: 0;
    position: absolute;
    top: 0;
    transition: width var(--durationM) var(--ease1);
    width: var(--space2XL);
    z-index: 1;

    ${props => props.accent && css`
      background: rgb(var(--rgbWhite) / 0.2);
    `}
  }

  :focus, :hover, :active {
    ::before {
      width: 100%;
    }

    svg {
      margin-left: calc(var(--spaceXL) + 4px);
    }
  }
`;

export default Button;
