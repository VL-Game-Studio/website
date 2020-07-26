import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Socials from 'components/Socials';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Socials',
  decorators: [withKnobs],
};

export const socials = () => (
  <StoryContainer padding={32} gutter={32}>
    <Socials />
  </StoryContainer>
);
