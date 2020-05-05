import React, { Fragment } from 'react';
import styled, { useTheme } from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title } from 'components/Type';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { reflow } from 'utils/transition';
import { rgba } from 'utils/style';

export default function Community(props) {
  const { id, sectionRef, visible = true, ...rest } = props;
  const labelId = `${id}-title`;
  const { colorWhite } = useTheme();

  return (
    <CommunityWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={labelId}
      {...rest}
    >
      <Transition
        in={visible}
        timeout={0}
        onEnter={reflow}
      >
        {status => (
          <Fragment>
            <CommunityContent status={status}>
              <Label id={labelId} aria-label="Community">Community</Label>
              <Title>Help us build the Modern format that Magic players deserve.</Title>
              <IconButton label="Join Discord">
                <Icon icon="discord" color={rgba(colorWhite, 0.8)} />
              </IconButton>
            </CommunityContent>
          </Fragment>
        )}
      </Transition>
    </CommunityWrapper>
  );
}

const CommunityWrapper = styled.section`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CommunityContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 160px 120px;
  max-width: 446px;

  @media (max-width: ${props => props.theme.mobile}px) {
    margin: 50px 40px;
  }
`;

const IconButton = styled(Button)`
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  font-size: 16px;
  height: 45px;
  justify-content: center;
  margin: 32px auto 0;
  max-height: 45px;
  width: 152px;

  svg {
    margin-right: 12px;
  }
`;
