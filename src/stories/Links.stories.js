import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Anchor from 'components/Anchor';
import { StoryContainer } from './StoryContainer';

export default {
  title: 'Links',
  decorators: [withKnobs],
};

export const anchor = () => (
  <StoryContainer padding={30} gutter={30} style={{ fontSize: 18 }}>
    <Anchor href="#" onClick={(e) => e.preventDefault()}>Anchor link</Anchor>
    <Anchor href="#" onClick={(e) => e.preventDefault()} accent>Accent link</Anchor>
  </StoryContainer>
);
