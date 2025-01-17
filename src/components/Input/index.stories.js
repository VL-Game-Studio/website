import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Input from 'components/Input';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Input',
  decorators: [withKnobs],
};

export const input = () => (
  <StoryContainer padding={32} gutter={32}>
    <Input placeholder="Input" />
  </StoryContainer>
);

export const textarea = () => (
  <StoryContainer padding={32} gutter={32}>
    <Input textarea placeholder="TextArea" />
  </StoryContainer>
);
