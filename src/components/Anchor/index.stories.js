import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Anchor from 'components/Anchor';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Links',
  decorators: [withKnobs],
};

export const anchor = () => (
  <StoryContainer padding={32} gutter={32} style={{ fontSize: 18 }}>
    <Anchor href="#" onClick={(e) => e.preventDefault()}>Anchor link</Anchor>
    <Anchor secondary href="#" onClick={(e) => e.preventDefault()}>Secondary link</Anchor>
  </StoryContainer>
);
