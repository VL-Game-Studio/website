import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'components/Link';
import Icon from 'components/Icon';

function Intro(props) {

  return (
    <IntroWrapper>
      <IntroContainer>
        <IntroContent>
          <Label>Project Modern</Label>
          <Title>A community-run format that puts players first</Title>
          <Paragraph>Project Modern is a community-backed format that prioritizes format health over profit.</Paragraph>
          <Button>
            <Link to="/">Get Started</Link>
            <Icon icon="arrowRight" />
          </Button>
        </IntroContent>
      </IntroContainer>
    </IntroWrapper>
  );
}

const IntroWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackground};
  display: flex;
  min-height: 100vh;
  overflow: hidden;
  padding-top: 0;
  padding: 0 50px;

  @media (max-width: ${props => props.theme.mobile}px) {
    padding: 0 20px;
  }
`;

const IntroContainer = styled.section`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;

  @media (max-width: ${props => props.theme.desktop}px) {
    max-width: 1080px;
  }

  @media (max-width: ${props => props.theme.laptop}px) {
    max-width: 960px;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: 100%;
  }
`;

const IntroContent = styled.div`
  margin-top: 100px;

  h1, p, button {
    margin-left: 50px;
  }

  h1 {
    margin-top: 45px;
    max-width: 658px;
  }

  p {
    margin-top: 20px;
    max-width: 530px;
  }

  @media (max-width: ${props => props.theme.desktop}px) {
    width: 70%;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    h1, p, button {
      margin-left: 0;
    }

    h1 {
      margin-top: 33px;
    }
  }
`;

const Label = styled.label`
  color: ${props => props.theme.colorAccent};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.6em;
  line-height: 32px;
  text-transform: uppercase;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 14px;
    line-height: 24px;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colorTitle};
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 90px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 38px;
    line-height: 44px;
  }
`;

const Paragraph = styled.p`
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 36px;

  @media (max-width: ${props => props.theme.desktop}px) {
    width: 80%;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    width: 70%;
  }
`;

const Button = styled.button`
  background: none;
  border-style: none;
  cursor: pointer;
  height: 48px;
  margin-top: 60px;
  outline: 0;
  padding: 0 24px;
  display: flex;
  align-items: center;

  &, a {
    color: ${props => props.theme.colorTitle};
    font-family: ${props => props.theme.fontStack};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.25em;
    line-height: 24px;
    position: relative;
    text-decoration: none;
    text-transform: uppercase;
  }

  a, svg {
    z-index: 2;
  }

  svg {
    display: inline-block;
    margin-left: 28px;
    opacity: 0.7;
    position: relative;
  }

  ::before {
    background: #323135;
    border-radius: 50%;
    content: '';
    display: block;
    height: 48px;
    width: 48px;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    transition: width 0.45s ${props => props.theme.bezierFastoutSlowin};
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 14px;
    margin-top: 45px;
  }
`;

export default memo(Intro);
