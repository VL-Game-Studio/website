import styled, { css } from 'styled-components/macro';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 3rem;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 3rem;
  position: relative;

  @media (min-width: ${props => props.theme.mobile}px) {
    margin: 0px 5.55555%;
    padding-bottom: 7rem;
    padding-top: 7rem;
  }

  @media (min-width: ${props => props.theme.laptop}px) {
    margin: 0px 11.1111%;
  }

  @media (min-width: ${props => props.theme.desktop}px) {
    margin: 0px 16.6666%;
  }

  ${props => props.orientation === 'right' && css`
    flex-direction: row-reverse;
  `}
`;

export default Wrapper;
