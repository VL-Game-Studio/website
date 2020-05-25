import styled from 'styled-components/macro';

export const Label = styled.label`
  color: ${props => props.color || props.theme.colorAccent};
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

export const Title = styled.h1`
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorTitle};
  font-size: 72px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 90px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 38px;
    line-height: 44px;
  }
`;

export const Title2 = styled.h2`
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorTitle};
  font-size: 54px;
  font-weight: 700;
  line-height: 74px;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 28px;
    line-height: 34px;
  }
`;

export const Paragraph = styled.p`
  font-size: 20px;
  font-weight: 300;
  letter-spacing: 0.03em;
  line-height: 36px;
  color: ${props => props.dark ? props.theme.colorWhite : props.theme.colorText};

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 16px;
    line-height: 32px;
  }
`;
