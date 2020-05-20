import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';

function Header(props) {

  return (
    <HeaderWrapper role="banner">
      <Link
        to={{ pathname: '/', hash: '#intro' }}
        aria-label="Project Modern, Putting Players First"
      >
        <Icon icon="logo" />
      </Link>
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
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.55s ${props => props.theme.bezierFastoutSlowin};
  z-index: 1024;

  &, a {
    color: ${props => props.theme.colorWhite};
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    height: 116px;
    max-width: calc(100% - 40px);
  }
`;

export default memo(Header);
