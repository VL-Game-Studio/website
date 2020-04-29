import styled from 'styled-components/macro';
import { rgba } from 'utils/style';

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
`;

export const Paragraph = styled.p`
  color: ${props => rgba(props.theme.colorTitle, 0.6)};
  font-size: 16px;
  font-weight: 500;
  line-height: 1.7;
  margin-top: 24px;

  :first-of-type {
    margin-top: 0;
  }
`;
