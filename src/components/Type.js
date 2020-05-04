import styled from 'styled-components/macro';

export const Label = styled.label`
  color: ${props => props.theme.colorAccent};
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 24px;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colorTitle};
  font-size: 32px;
  font-weight: 500;

  @media (max-width: ${props => props.theme.mobile}px) {
    font-size: 24px;
  }
`;

export const Paragraph = styled.p`
  color: ${props => props.theme.colorText};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  margin-top: 24px;

  :first-of-type {
    margin-top: 0;
  }
`;
