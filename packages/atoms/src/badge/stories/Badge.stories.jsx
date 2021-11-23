import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '../'

export default {
  title: 'Jenga-UI / Atoms / Badge',
  component: Badge,
  argTypes: {
    type: {
      control: {
        type: 'inline-radio',
        options: [undefined, 'note', 'success', 'danger'],
      },
      description: 'Type of the alert',
      defaultValue: undefined,
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'note' },
      },
    },
  },
}

const Template = ({ label, ...props }) => <Badge {...props}>{label}</Badge>

Template.propTypes = {
  label: PropTypes.node,
}

export const Default = Template.bind({})
Default.args = {
  label: '1',
}
