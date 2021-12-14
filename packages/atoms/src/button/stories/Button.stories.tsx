import React from 'react'
import { DollarCircleOutlined } from '@ant-design/icons'
import Button from '../src/Button'
import { ButtonProps } from '../src/ButtonProps'

export default {
  title: 'jenga-ui / Atoms / Button',
  component: Button,
  argTypes: {
    icon: {
      defaultValue: false,
      description: 'Show the icon',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    isDisabled: {
      defaultValue: false,
      description: 'Disables the button.',
      control: {
        type: 'boolean',
      },
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state with spinner. Also works as disabled',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    type: {
      defaultValue: 'default',
      description: "A visual type of the button. Don't affect any logic",
      control: {
        type: 'radio',
        options: [
          undefined,
          'default',
          'primary',
          'link',
          'outline',
          'danger',
          'clear',
          'item',
          'tab',
        ],
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    isSelected: {
      control: 'boolean',
      description: 'Selected state for Tab type buttons',
      defaultValue: false,
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    size: {
      defaultValue: undefined,
      description: 'The size of the button',
      control: {
        type: 'radio',
        options: [undefined, 'default', 'small'],
      },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    radius: {
      defaultValue: undefined,
      control: {
        type: 'radio',
        options: [undefined, '0', '1r', 'round'],
      },
      table: {
        type: { summary: 'string|number' },
        defaultValue: { summary: '1r' },
      },
    },
    label: {
      defaultValue: 'Button',
      control: 'text',
    },
  },
}

const Template = (props: ButtonProps) => {
  const { size, type, radius, isSelected, isDisabled, isLoading, label, icon } =
    props
  return (
    <Button
      size={size}
      type={type}
      radius={radius}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isSelected={isSelected}
      icon={icon ? <DollarCircleOutlined /> : undefined}
      onPress={() => console.log('Press')}
    >
      {label}
    </Button>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Button',
}

export const Primary = Template.bind({})
Primary.args = {
  type: 'primary',
  label: 'Button',
}

export const Outline = Template.bind({})
Outline.args = {
  type: 'outline',
  label: 'Button',
}

export const Clear = Template.bind({})
Clear.args = {
  type: 'clear',
  label: 'Button',
}

export const Item = Template.bind({})
Item.args = {
  label: 'Button',
  type: 'item',
}

export const Tab = Template.bind({})
Tab.args = {
  label: 'Tab',
  type: 'tab',
  selected: true,
}

export const Link = Template.bind({})
Link.args = {
  label: 'Link',
  type: 'link',
  selected: true,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  icon: true,
}

export const Loading = Template.bind({})
Loading.args = {
  icon: true,
  isLoading: true,
  label: '',
}
