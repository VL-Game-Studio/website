import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { Label, Title, Title2, Paragraph } from 'components/Type';
import { StoryContainer } from '../../../.storybook/StoryContainer';

export default {
  title: 'Type',
  decorators: [withKnobs],
};

export const label = () => (
  <StoryContainer padding={32} gutter={32}>
    <Label>Label Text</Label>
  </StoryContainer>
);

export const title = () => (
  <StoryContainer padding={32} gutter={32}>
    <Title>Title One</Title>
  </StoryContainer>
);

export const titleTwo = () => (
  <StoryContainer padding={32} gutter={32}>
    <Title2>Title Two</Title2>
  </StoryContainer>
);

export const paragraph = () => (
  <StoryContainer padding={32} gutter={32}>
    <Paragraph>Paragraph Text</Paragraph>
  </StoryContainer>
);
