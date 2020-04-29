import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import { Transition } from 'react-transition-group';
import { Label, Title, Paragraph } from 'components/Type';
import { Link } from 'components/Link';
import { reflow } from 'utils/transition';

export default function About(props) {
  const { id, sectionRef, visible = true, ...rest } = props;
  const labelId = `${id}-label`

  return (
    <AboutWrapper
      ref={sectionRef}
      id={id}
      aria-labelledby={labelId}
      tabIndex={-1}
      {...rest}
    >
      <Transition
        in={visible}
        timeout={0}
        onEnter={reflow}
      >
        {status => (
          <Fragment>
            <AboutContent status={status}>
              <Column>
                <Label id={labelId} aria-label="About Us">About Us</Label>
                <Title>We provide players a stable, nonincorporated Modern format rid of rotation due to new design.</Title>
              </Column>
              <Column>
              <Paragraph>
                Ever since WAR dropped it's become increasingly clear that many Modern players have questions about the direction of current game design. Modern has stopped being a non rotating format in light of the power creep that's gone on since 2019.
              </Paragraph>
              <Paragraph>
                Videre is a community-run constructed format with the card pool that was the Modern preceding WAR (<Link to="/rules#banlist">see complete ban list</Link>) with bans centered around data-driven community feedback. Our focus is cultivating a environment with a diversity of archetypes and play patterns while maintaining balance.
              </Paragraph>
              </Column>
            </AboutContent>
          </Fragment>
        )}
      </Transition>
    </AboutWrapper>
  );
}

const AboutWrapper = styled.section`
  align-items: center;
  background: ${props => props.theme.colorBackgroundLight};
  display: flex;
  justify-content: center;
  width: 100%;
`;

const AboutContent = styled.div`
  display: grid;
  grid-gap: 142px;
  grid-template-columns: 446px 446px;
  margin: 155px 120px;

  @media (max-width: ${props => props.theme.tablet}px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
    grid-row-gap: 30px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
