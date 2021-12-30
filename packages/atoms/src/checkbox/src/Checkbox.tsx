import { useFocusableRef } from '@react-spectrum/utils'
import React, { forwardRef, useContext, useRef } from 'react'
import { AriaCheckboxProps } from '@react-types/checkbox'
import { useCheckbox, useCheckboxGroupItem } from '@react-aria/checkbox'
import { useHover } from '@react-aria/interactions'
import { useToggleState } from '@react-stately/toggle'
// import { useProviderProps } from '../../../provider'
import { useProviderProps, useFocus, filterBaseProps } from '@jenga-ui/core'
import {
  extractStyles,
  BaseProps,
  Styles,
  useContextStyles,
  BLOCK_STYLES,
  OUTER_STYLES,
  Element,
} from 'tastycss-react'
import { mergeProps } from '@react-aria/utils'
import {
  useFormProps,
  HiddenInput,
  FieldWrapper,
  FormFieldProps,
  INLINE_LABEL_STYLES,
  LABEL_STYLES,
} from '../../form'
import { CheckboxGroup } from './CheckboxGroup'
import { CheckboxGroupContext } from './context'
import { FocusableRef } from '@react-types/shared'

export interface JengaCheckboxProps
  extends BaseProps,
    AriaCheckboxProps,
    FormFieldProps {}

const CheckOutlined = () => (
  <svg width="10" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.417 7.604l-.017.018-3.4-3.4 1.433-1.433 1.985 1.985L8.192 0l1.432 1.433-6.189 6.189-.018-.018z"
      fill="currentColor"
    />
  </svg>
)
const IndeterminateOutline = () => (
  <svg width="9" height="3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 .044v2.001l.026.025h8.063V.044H0z" fill="#fff" />
  </svg>
)

const DEFAULT_STYLES: Styles = {
  position: 'relative',
  display: 'flex',
  placeItems: 'center start',
  gap: '1x',
  flow: 'row',
  preset: 'default',
  cursor: 'pointer',
} as const

const INPUT_STYLES: Styles = {
  display: 'grid',
  placeItems: 'center',
  radius: '.5r',
  fill: {
    '': '#white',
    'checked | indeterminate': '#purple-text',
    'invalid & !checked': '#white',
    'invalid & checked': '#danger-text',
    disabled: '#dark.12',
  },
  color: {
    '': '#white',
    'disabled & !checked & !indeterminate': '#clear',
  },
  border: {
    '': '#dark.30',
    invalid: '#danger-text.50',
    'disabled | ((indeterminate | checked) & !invalid)': '#clear',
  },
  width: '(2x - 2bw)',
  height: '(2x - 2bw)',
  outline: {
    '': '#purple-03.0',
    focused: '#purple-03',
  },
  transition: 'theme',
} as const

function Checkbox(props: JengaCheckboxProps, ref: FocusableRef) {
  const originalProps = props

  props = useProviderProps(props)
  props = useFormProps(props)

  const {
    qa,
    isIndeterminate = false,
    isDisabled = false,
    insideForm,
    isRequired,
    autoFocus,
    children,
    validationState,
    labelProps,
    labelPosition,
    necessityLabel,
    necessityIndicator,
    message,
    requiredMark = true,
    ...otherProps
  } = props

  let { label, labelStyles } = props

  label = label || children

  // Swap hooks depending on whether this checkbox is inside a CheckboxGroup.
  // This is a bit unorthodox. Typically, hooks cannot be called in a conditional,
  // but since the checkbox won't move in and out of a group, it should be safe.
  const groupState = useContext(CheckboxGroupContext)

  const wrapperContextStyles = useContextStyles('Checkbox_Wrapper', props)
  const inputContextStyles = useContextStyles('Checkbox', props)
  const labelContextStyles = useContextStyles('Checkbox_Label', props)

  const styles: Styles = extractStyles(props, OUTER_STYLES, {
    ...(insideForm && !groupState ? {} : DEFAULT_STYLES),
    ...wrapperContextStyles,
  })
  const inputStyles = extractStyles(props, BLOCK_STYLES, {
    ...INPUT_STYLES,
    ...inputContextStyles,
  })

  labelStyles = {
    ...(insideForm && !groupState ? LABEL_STYLES : INLINE_LABEL_STYLES),
    ...labelContextStyles,
    ...labelStyles,
  }

  if (!insideForm) {
    labelStyles.fontWeight = 400
  }

  if (insideForm && labelPosition === 'side') {
    inputStyles.marginTop = '1x'
  }

  const { isFocused, focusProps } = useFocus({ isDisabled }, true)
  const { hoverProps, isHovered } = useHover({ isDisabled })

  const inputRef = useRef(null)
  const domRef = useFocusableRef(ref, inputRef)

  const { inputProps } = groupState
    ? useCheckboxGroupItem(
        {
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires strictNullChecks disabled).
          value: props.value || '',
          // Only pass isRequired and validationState to react-aria if they came from
          // the props for this individual checkbox, and not from the group via context.
          isRequired: originalProps.isRequired,
          validationState: originalProps.validationState,
        },
        groupState,
        inputRef
      )
    : useCheckbox(props, useToggleState(props), inputRef)

  const markIcon = isIndeterminate ? (
    <IndeterminateOutline />
  ) : (
    <CheckOutlined />
  )

  if (groupState) {
    for (const key of ['isSelected', 'defaultSelected', 'isEmphasized']) {
      if (originalProps[key] != null) {
        console.warn(
          `Jenga-UI: ${key} is unsupported on individual <Checkbox> elements within a <CheckboxGroup>. Please apply these props to the group instead.`
        )
      }
    }
    if (props.value == null) {
      console.warn(
        'Jenga-UI: A <Checkbox> element within a <CheckboxGroup> requires a `value` property.'
      )
    }
  }

  const checkboxField = (
    <Element styles={{ position: 'relative' }}>
      <HiddenInput
        data-qa={qa || 'Checkbox'}
        {...mergeProps(inputProps, focusProps)}
        ref={inputRef}
      />
      <Element
        mods={{
          checked: inputProps.checked,
          indeterminate: isIndeterminate,
          invalid: validationState === 'invalid',
          valid: validationState === 'valid',
          disabled: isDisabled,
          hovered: isHovered,
          focused: isFocused,
        }}
        styles={inputStyles}
      >
        {markIcon}
      </Element>
    </Element>
  )

  if (insideForm && !groupState) {
    return (
      <FieldWrapper
        {...{
          as: 'label',
          labelPosition,
          label,
          insideForm,
          styles,
          isRequired,
          labelStyles,
          labelProps,
          isDisabled,
          validationState,
          necessityLabel,
          necessityIndicator,
          message,
          requiredMark,
          Component: checkboxField,
          ref: domRef,
        }}
      />
    )
  }

  return (
    <Element
      as="label"
      styles={styles}
      {...hoverProps}
      {...filterBaseProps(otherProps)}
      ref={domRef}
    >
      {checkboxField}
      {label && (
        <Element
          styles={labelStyles}
          mods={{
            invalid: validationState === 'invalid',
            valid: validationState === 'valid',
            disabled: isDisabled,
          }}
          {...filterBaseProps(labelProps)}
        >
          {label}
        </Element>
      )}
    </Element>
  )
}

/**
 * Checkboxes allow users to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 */
const _Checkbox = Object.assign(forwardRef(Checkbox), {
  cubeInputType: 'Checkbox',
  Group: CheckboxGroup,
})
export { _Checkbox as Checkbox }
