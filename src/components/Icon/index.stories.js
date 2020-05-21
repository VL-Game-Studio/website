import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import Icon from 'components/Icon';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Icons',
  decorators: [withKnobs],
};

export const logo = () => (
  <StoryContainer padding={30} gutter={30} style={{ color: '#111' }}>
    <Icon icon="logo" />
  </StoryContainer>
);

export const links = () => (
  <StoryContainer padding={30} gutter={30} style={{ color: '#111' }}>
    <Icon icon="arrowRight" />
  </StoryContainer>
);
