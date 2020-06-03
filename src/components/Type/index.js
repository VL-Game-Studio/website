import styled, { keyframes, css } from 'styled-components/macro';

const Pulse = keyframes`
  0% {
    opacity: .6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

export const Label = styled.label`
  color: ${props => props.color || props.theme.colorAccent};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.6em;
  line-height: 32px;
  text-transform: uppercase;
  background: none;

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: #CDCDCD;
    color: #CDCDCD!important;
    height: 32px;
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 14px;
    line-height: 24px;

    ${props => props.loading && css`
      height: 24px;
    `}
  }
`;

export const Title = styled.h1`
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorTitle};
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 90px;

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: #CDCDCD;
    color: #CDCDCD!important;
    height: 90px;
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 38px;
    line-height: 44px;

    ${props => props.loading && css`
      height: 44px;
    `}
  }
`;

export const Title2 = styled.h2`
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorTitle};
  font-size: 54px;
  font-weight: 700;
  line-height: 74px;

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: #CDCDCD;
    color: #CDCDCD!important;
    height: 74px;
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 28px;
    line-height: 34px;

    ${props => props.loading && css`
      height: 34px;
    `}
  }
`;

export const Paragraph = styled.p`
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 36px;
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorText};

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: #CDCDCD;
    color: #CDCDCD!important;
    height: 36px;
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 16px;
    line-height: 32px;

    ${props => props.loading && css`
      height: 32px;
    `}
  }
`;
