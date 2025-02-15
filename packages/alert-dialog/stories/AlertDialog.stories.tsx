import { expect } from '@storybook/jest';
import { ComponentMeta, Story } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { action } from '@storybook/addon-actions';

import { baseProps } from '../../../storybook/stories/lists/baseProps';
import { DialogTrigger } from '@jengaui/dialog';
import { Button } from '@jengaui/button';
import { Paragraph } from '@jengaui/content';
import { wait } from '../../../test/utils/wait';

import { useAlertDialogAPI } from '../src/AlertDialogApiProvider';
import { AlertDialog, JengaAlertDialogProps } from '../src/AlertDialog';
import { DialogProps } from '../src/types';

export default {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  args: {
    content: (
      <Paragraph>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A animi
        aperiam cupiditate eius est illo inventore quis rem! At cupiditate
        molestias placeat quasi reprehenderit similique voluptatibus voluptatum.
        Alias atque, distinctio.
      </Paragraph>
    ),
  },
  parameters: { controls: { exclude: baseProps } },
} as ComponentMeta<typeof AlertDialog>;

const Template: Story<JengaAlertDialogProps> = (args) => {
  return (
    <DialogTrigger
      isDismissable
      placement="top"
      onDismiss={(action) => console.log('onDismiss event', action)}
    >
      <Button>Open Modal</Button>

      {() => <AlertDialog title="Title" {...args} />}
    </DialogTrigger>
  );
};

export const Default = Template.bind({});
Default.args = {};
Default.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await userEvent.click(getByRole('button'));
  await expect(getByRole('alertdialog')).toBeInTheDocument();
};

export const UsingApi: Story<DialogProps> = (args) => {
  const dialogAPI = useAlertDialogAPI();

  return (
    <Button
      {...args}
      onPress={async () =>
        dialogAPI
          .open(args)
          .then(action('DialogClosed'))
          .catch(action('DialogClosedWithReject'))
      }
    >
      Open Modal
    </Button>
  );
};
UsingApi.play = async ({ canvasElement }) => {
  const { getByRole } = within(canvasElement);
  await userEvent.click(getByRole('button'));

  await expect(getByRole('alertdialog')).toBeInTheDocument();
};

export const UsingApiWithCancel: Story<DialogProps> = (args) => {
  const dialogAPI = useAlertDialogAPI();

  return (
    <Button
      onPress={() => {
        const cancelDialog = new AbortController();

        const openedDialog = dialogAPI.open(
          {
            ...args,
            actions: {
              confirm: {
                qa: 'CancelToken',
                onPress: () => cancelDialog.abort(),
                children: 'Click to close via cancel token',
              },
            },
          },
          { cancelToken: cancelDialog.signal },
        );

        openedDialog
          .then(action('DialogClosed'))
          .catch(action('DialogClosedWithReject'));
      }}
    >
      Open Modal
    </Button>
  );
};
UsingApiWithCancel.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId, queryByRole } = within(canvasElement);

  await userEvent.click(getByRole('button'));
  await expect(queryByRole('alertdialog')).toBeInTheDocument();
  await userEvent.click(getByTestId('CancelToken'));
  await wait(300);
  await expect(queryByRole('alertdialog')).not.toBeInTheDocument();
};
