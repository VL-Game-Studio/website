import React from 'react';
import styled, { css } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import Button from 'components/Button';
import { reflow } from 'utils/transition';
import { rgba } from 'utils/style';

export default function Overlay(props) {
  const { visible, title, description, children, onCancel, onSubmit } = props;

  return (
    <Transition
      appear
      in={visible}
      timeout={100}
      onEnter={reflow}
    >
      {status => (
        <OverlayWrapper visible={visible}>
          <OverlayInner>
            <OverlayBackground status={status} />
            <OverlayContainer status={status}>
              <OverlayContent>
                <h4>{title}</h4>
                <OverlayChildren>
                  <p>{description}</p>
                  {children}
                </OverlayChildren>
                <OverlayControls>
                  <Button outline label="Cancel" onClick={onCancel} />
                  <Button label="Submit" onClick={onSubmit} />
                </OverlayControls>
              </OverlayContent>
            </OverlayContainer>
          </OverlayInner>
        </OverlayWrapper>
      )}
    </Transition>
  );
}

const OverlayWrapper = styled.div`
  inset: 0px;
  pointer-events: none;
  position: fixed;
  width: 100%;

  ${props => !props.visible && css`
    * {
      pointer-events: none!important;
    }
  `}
`;

const OverlayInner = styled.div`
  inset: 0px;
  position: absolute;
  z-index: 10;
`;

const OverlayBackground = styled.div`
  background: ${props => props.theme.colorBlack} none repeat scroll 0% 0%;
  inset: 0px;
  opacity: 0.85;
  pointer-events: all;
  position: absolute;
  transition: all 150ms ease 0s;

  ${props => props.status !== 'entered' && css`
    opacity: 0;
  `}
`;

const OverlayContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  pointer-events: none;
  position: relative;
  transition: all 150ms ease 0s;
  width: 100%;

  ${props => props.status !== 'entered' && css`
    opacity: 0;
    transform: scale(0.75);
  `}
`;

const OverlayContent = styled.div`
  background: ${props => props.theme.colorBackgroundDiscord} none repeat scroll 0% 0%;
  border-radius: 5px;
  color: ${props => props.theme.colorWhite};
  max-width: calc(-48px + 100vw);
  pointer-events: all;
  width: 500px;

  h4 {
    color: ${props => rgba(props.theme.colorWhite, 0.8)};
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.3px;
    line-height: 20px;
    margin: 20px;
    text-transform: uppercase;
  }

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: calc(-32px + 100vw);
  }
`;

const OverlayChildren = styled.div`
  padding: 0px 12px 12px;

  p {
    margin: 8px;
  }
`;

const OverlayControls = styled.div`
  align-items: center;
  background: rgb(47, 49, 54) none repeat scroll 0% 0%;
  border-radius: 0px 0px 5px 5px;
  display: flex;
  justify-content: flex-end;
  padding: 20px;

  * {
    margin: 0;

    :last-of-type {
      margin: 0px 0px 0px 16px;
    }
  }
`;
