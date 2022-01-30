import React from 'react'
import { Tooltip } from './Tooltip'
import { Button } from '@jenga-ui/button'
import { TooltipTrigger } from './TooltipTrigger'
import { TooltipProvider } from './TooltipProvider'
import { Block } from '@jenga-ui/core'

export default {
  title: 'UIKit/Overlays/Tooltip',
  component: Tooltip,
  argTypes: {
    placement: {
      defaultValue: undefined,
      control: {
        type: 'radio',
        options: [undefined, 'top', 'right', 'bottom', 'left'],
      },
      description:
        'The placement of the element with respect to its anchor element.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    delay: {
      defaultValue: undefined,
      control: 'number',
      description: 'The delay time for the tooltip to show up. See guidelines.',
    },
    trigger: {
      defaultValue: undefined,
      control: {
        type: 'inline-radio',
        options: [undefined, 'focus'],
      },
      description:
        'By default, opens for both focus and hover. Can be made to open only for focus.',
    },
    isDisabled: {
      defaultValue: false,
      description:
        'Whether the tooltip should be disabled, independent from the trigger.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    offset: {
      defaultValue: undefined,
      control: 'number',
      description:
        'The additional offset applied along the main axis between the element and its anchor element.',
    },
    crossOffset: {
      defaultValue: undefined,
      control: 'number',
      description:
        'The additional offset applied along the cross axis between the element and its anchor element.',
    },
    shouldFlip: {
      defaultValue: undefined,
      control: {
        type: 'inline-radio',
        options: [undefined, false, true],
      },
      description:
        'Whether the element should flip its orientation (e.g. top to bottom or left to right) when there is insufficient room for it to render completely.',
    },
  },
}

const Template = (args) => (
  <TooltipTrigger {...args}>
    <Button margin="8x 18x">Hover to show a tooltip</Button>
    <Tooltip>Tooltip content</Tooltip>
  </TooltipTrigger>
)

const ViaProviderTemplate = (args) => (
  <TooltipProvider title="Tooltip content" {...args}>
    <Button margin="8x 18x">Hover to show a tooltip</Button>
  </TooltipProvider>
)

const ViaProviderWithActiveWrapTemplate = (args) => (
  <Block padding="8x 18x">
    <TooltipProvider title="Tooltip content" activeWrap {...args}>
      Hover to show a tooltip
    </TooltipProvider>
  </Block>
)

export const Default = Template.bind({})
Default.args = {}

export const ViaProvider = ViaProviderTemplate.bind({})
ViaProvider.args = {}

export const ViaProviderWithActiveWrap = ViaProviderWithActiveWrapTemplate.bind(
  {}
)
ViaProviderWithActiveWrap.args = {}
