import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Anchor from 'components/Anchor';
import Icon from 'components/Icon';
import { rgba } from 'utils/style';

const Footer = () => (
  <FooterWrapper>
    <FooterContent>
      <Colophon>
        <LogotypeWrapper to="/">
          <Icon icon="logo" height="28px" />
        </LogotypeWrapper>
        <Text>
          &copy; {new Date().getFullYear()}
        </Text>
      </Colophon>
      <Column>
        <Title>Community</Title>
        <FooterLink href="https://github.com/VidereMTG">
          <Icon icon="github" /> GitHub
        </FooterLink>
        <FooterLink href="https://discord.gg/mjtTnr8">
          <Icon icon="discord" /> Discord chat
        </FooterLink>
      </Column>
    </FooterContent>
  </FooterWrapper>
);

const Title = styled.div`
  color: ${props => props.theme.colorText};
  display: block;
  font-size: 12px;
  margin-bottom: 1rem;
`;

const LogotypeWrapper = styled(Anchor)`
  color: ${props => props.theme.colorAccent}!important;
  display: block;
  margin-bottom: 1rem;

  svg {
    display: block;
    height: auto;
    transform: translate3d(0, 0, 0);
    transition: all 150ms ease-out;
    width: 140px;

    &:hover {
      transform: translate3d(0, -1px, 0);
    }

    &:active {
      transform: translate3d(0, 0, 0);
    }
  }
`;

const FooterLink = styled(Anchor)`
  color: ${props => props.theme.colorText};
`;

const Text = styled.div`
  color: ${props => props.theme.colorTitle};
`;

const Colophon = styled.div`
  a {
    display: inline-block;
    vertical-align: top;
  }
`;

const Column = styled.div`
  > ${FooterLink} {
    display: block;
    margin-bottom: 0.75rem;
  }
`;

const Subscribe = styled.div`
  ${Text} {
    margin-bottom: 1rem;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-top: 3rem;

  @media (min-width: ${props => props.theme.mobile}px) {
    margin: 0px 5%;
  }

  @media (min-width: ${props => props.theme.laptop}px) {
    margin: 0px 10%;
  }

  @media (min-width: ${props => props.theme.desktop}px) {
    margin: 0px 15%;
  }

  ${Colophon} {
    display: block;
    margin-bottom: 3rem;
    width: 100%;

    @media (min-width: ${props => props.theme.mobile}px) {
      margin-bottom: 3rem;
      max-width: 200px;
      width: auto;
    }
  }

  ${Column} {
    margin-bottom: 2.25rem;
    width: 50%;

    @media (min-width: ${props => props.theme.mobile}px) {
      margin-bottom: 2.25rem;
      padding-right: 20px;
      width: auto;
    }
  }

  ${Subscribe} {
    margin-bottom: 3rem;
    width: 100%;

    @media (min-width: ${props => props.theme.mobile}px) {
      margin-bottom: 3rem;
      width: auto;
    }
  }
`;

const FooterWrapper = styled.div`
  background-color: ${props => props.theme.colorBackgroundLight};
  border-top: 1px solid ${props => rgba(props.theme.colorBlack, 0.1)};
  font-size: 14px;
  line-height: 20px;
`;

export default memo(Footer);
