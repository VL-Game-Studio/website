import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Button from 'components/Button';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Buttons',
  decorators: [withKnobs],
};

export const button = () => (
  <StoryContainer padding={30} gutter={30}>
    <Button label="Button" />
    <Button href="#" onClick={(e) => e.preventDefault()} label="Button Link" />
  </StoryContainer>
);
