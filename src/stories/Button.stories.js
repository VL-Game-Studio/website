import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Button from 'components/Button';
import { StoryContainer } from './StoryContainer';

export default {
  title: 'Button',
  decorators: [withKnobs],
};

export const button = () => (
  <StoryContainer padding={30} gutter={30}>
    <Button label="Button" />
    <Button label="Shiny Button" shiny />
    <Button label="Disabled Button" disabled />
    <Button label="Secondary Button" secondary />
    <Button label="Outline Button" outline />
  </StoryContainer>
);
