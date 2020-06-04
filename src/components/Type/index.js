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
  color: rgb(${props => props.color || 'var(--rgbAccent)'});
  font-size: var(--fontSizeH3);
  font-weight: var(--fontWeightSemiBold);
  letter-spacing: var(--letterSpacingH3);
  line-height: var(--lineHeightTitle);
  text-transform: uppercase;
  background: none;

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: rgb(var(--rgbBlack) / 0.2);
    color: rgb(var(--rgbBlack) / 0.2)!important;
    height: calc(var(--fontSizeH3) * var(--lineHeightTitle));
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}
`;

export const Title = styled.h1`
  color: rgb(${props => props.dark
    ? 'var(--rgbWhite)'
    : 'var(--rgbText)'});
  font-size: var(--fontSizeH1);
  font-weight: var(--fontWeightBold);
  letter-spacing: var(--letterSpacingH1);
  line-height: var(--lineHeightTitle);

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: rgb(var(--rgbBlack) / 0.2);
    color: rgb(var(--rgbBlack) / 0.2)!important;
    height: calc(var(--fontSizeH1) * var(--lineHeightTitle));
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}
`;

export const Title2 = styled.h2`
  color: rgb(${props => props.dark ?
    'var(--rgbWhite)' :
    'var(--rgbText)'});
  font-size: var(--fontSizeH2);
  font-weight: var(--fontWeightBold);
  line-height: var(--lineHeightTitle);

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: rgb(var(--rgbBlack) / 0.2);
    color: rgb(var(--rgbBlack) / 0.2)!important;
    height: calc(var(--fontSizeH2) * var(--lineHeightTitle));
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}
`;

export const Paragraph = styled.p`
  color: ${props => props.dark
    ? 'rgb(var(--rgbWhite))'
    : 'var(--colorTextBody)'};
  font-size: var(--fontSizeBody);
  font-weight: var(--fontWeightLight);
  letter-spacing: var(--letterSpacingBody);
  line-height: var(--lineHeightBody);

  ${props => props.loading && css`
    animation: ${Pulse} 1.5s infinite;
    background: rgb(var(--rgbBlack) / 0.2);
    color: rgb(var(--rgbBlack) / 0.2)!important;
    height: calc(var(--fontSizeBody) * var(--lineHeightBody));
    width: 100%;

    ::before, ::after {
      opacity: 0;
    }
  `}
`;
