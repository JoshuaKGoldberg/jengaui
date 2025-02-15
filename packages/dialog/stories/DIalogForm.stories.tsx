import {
  userEvent,
  waitForElementToBeRemoved,
  within,
} from '@storybook/testing-library';
import { ComponentMeta, StoryFn } from '@storybook/react';
import { expect } from '@storybook/jest';
import { useState } from 'react';

import { JengaDialogFormProps, DialogForm } from '../src/DialogForm';
import { Button } from '@jengaui/button';
import { Text, Paragraph } from '@jengaui/content';
import { Input } from '@jengaui/input';
import { DialogTrigger } from '../src/DialogTrigger';
import { baseProps } from '../../../storybook/stories/lists/baseProps';
import { Form } from '@jengaui/form';
import { DialogContainer } from '../src/DialogContainer';

export default {
  title: 'Overlays/DialogForm',
  component: DialogForm,
  parameters: { controls: { exclude: baseProps } },
} as ComponentMeta<typeof DialogForm>;

const TemplateTrigger: StoryFn<JengaDialogFormProps> = (args) => {
  return (
    <DialogTrigger>
      <Button>Open</Button>

      <DialogForm {...args} />
    </DialogTrigger>
  );
};

const TemplateContainer: StoryFn<JengaDialogFormProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setIsOpen(true)}>Open</Button>

      <DialogContainer isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <DialogForm {...args} />
      </DialogContainer>
    </>
  );
};

const DIALOG_CHILDREN = (
  <>
    <Paragraph>
      Are you sure you want to permanently delete&nbsp;
      <Text.Strong style={{ whiteSpace: 'pre' }}>deployment</Text.Strong>?
    </Paragraph>
    <Form.Item
      name="name"
      rules={[
        {
          validator(rule, value) {
            return value === 'deployment'
              ? Promise.resolve()
              : Promise.reject('Please enter your deployment name!');
          },
        },
      ]}
    >
      <Input.Text
        placeholder="Enter deployment"
        data-qa="DeleteDeploymentName"
      />
    </Form.Item>
  </>
);

export const AsyncExampleTrigger = TemplateTrigger.bind({});
AsyncExampleTrigger.args = {
  title: 'Confirm delete',
  submitProps: { theme: 'danger', label: 'Delete', qa: 'Delete' },
  onSubmit: () => new Promise((resolve) => setTimeout(resolve, 1_500)),
  children: DIALOG_CHILDREN,
};

export const AsyncExampleContainer = TemplateContainer.bind({});
AsyncExampleContainer.args = {
  title: 'Confirm delete',
  submitProps: { theme: 'danger', label: 'Delete', qa: 'Delete' },
  onSubmit: () => new Promise((resolve) => setTimeout(resolve, 1_500)),
  children: DIALOG_CHILDREN,
};

AsyncExampleTrigger.play = async ({ viewMode, canvasElement }) => {
  if (viewMode === 'docs') return;
  const screen = within(canvasElement);
  await userEvent.click(screen.getByRole('button'));
  const dialog = await screen.getByRole('dialog');
  await expect(dialog).toBeInTheDocument();

  const dialogCanvas = within(dialog);

  await userEvent.type(
    dialogCanvas.getByTestId('DeleteDeploymentName'),
    'deployment',
    { delay: 50 },
  );

  await userEvent.click(dialogCanvas.getByTestId('Delete'));
  await waitForElementToBeRemoved(dialog);
  await expect(dialog).not.toBeInTheDocument();
};

AsyncExampleContainer.play = async ({ viewMode, canvasElement }) => {
  if (viewMode === 'docs') return;
  const screen = within(canvasElement);
  await userEvent.click(screen.getByRole('button'));
  const dialog = await screen.getByRole('dialog');
  await expect(dialog).toBeInTheDocument();

  const dialogCanvas = within(dialog);

  await userEvent.type(
    dialogCanvas.getByTestId('DeleteDeploymentName'),
    'deployment',
    { delay: 50 },
  );

  await userEvent.click(dialogCanvas.getByTestId('Delete'));
  await waitForElementToBeRemoved(dialog);
  await expect(dialog).not.toBeInTheDocument();
};
