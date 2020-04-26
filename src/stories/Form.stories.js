import React from 'react';
import styled from 'styled-components/macro';
import { withKnobs } from '@storybook/addon-knobs';
import Input from 'components/Input';
import Overlay from 'screens/Overlay';
import Form from 'components/Form';
import { StoryContainer } from './StoryContainer';
import prerender from 'utils/prerender';

export default {
  title: 'Form',
  decorators: [withKnobs],
};

export const input = () => (
  <StoryContainer padding={30} gutter={30}>
    <Input label="Input" placeholder="Placeholder" />
    <Input label="Input" />
  </StoryContainer>
);

export const textarea = () => (
  <StoryContainer padding={30} gutter={30}>
    <Input label="TextArea" placeholder="Placeholder" textarea />
    <Input label="TextArea" textarea />
  </StoryContainer>
);

export const overlay = () => (
  <StoryContainer padding={30} gutter={30}>
    <Overlay
      visible={!prerender}
      title="Overlay Title"
      description="Overlay Description"
      onSubmit={(e) => e.preventDefault()}
      onCancel={(e) => e.preventDefault()}
    >
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormRow>
          <Input label="Input 1" inline />
          <Input label="Input 2" inline />
        </FormRow>
        <Input label="TextArea" inline textarea />
      </Form>
    </Overlay>
  </StoryContainer>
);

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
