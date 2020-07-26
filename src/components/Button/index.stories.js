import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Button from 'components/Button';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Buttons',
  decorators: [withKnobs],
};

export const button = () => (
  <StoryContainer padding={32} gutter={32}>
    <Button label="Button" />
  </StoryContainer>
);
