import { useSliderState } from '@react-stately/slider';
import { forwardRef } from 'react';
import { useSlider } from '@react-aria/slider';
import { useNumberFormatter } from '@react-aria/i18n';
import { Track } from './SliderTrack';
import { SliderThumb } from './SliderThumb';
import { LabelContainer } from './LabelContainer';
import { SliderWrapper } from './SliderWrapper';
import { JengaBaseSliderProps } from './types';
import { filterBaseProps } from 'tastycss';
import { useProviderProps } from '@jengaui/providers';
import { useCombinedRefs } from '@jengaui/utils';
import { WithOutputs } from './SliderOutputs';

const BaseSlider = forwardRef((props: JengaBaseSliderProps, ref) => {
  props = useProviderProps(props);
  let {
    sliderLength = ['large', 'small'],
    thumbSize = 'small',
    labelPosition = 'top',
    formatOptions,
    thumbs = 1,
    minValue = 0,
    maxValue = 100,
    showOutputs = true,
    defaultValue,
    step = 1,
    isDisabled = false,
    thumbIcon = null,
    discrete = false,
    theme = 'default',
    ...otherProps
  } = props;

  const thumbSizeCatalog = {
    small: '12px',
    medium: '20px',
    large: '40px',
  };
  const sliderLengthCatalog = {
    small: '280px',
    medium: '310px',
    large: '570px',
  };

  if (Array.isArray(sliderLength)) {
    sliderLength = sliderLength.map((len) =>
      sliderLengthCatalog.hasOwnProperty(len) ? sliderLengthCatalog[len] : len,
    );
  } else {
    sliderLength = sliderLengthCatalog.hasOwnProperty(sliderLength)
      ? sliderLengthCatalog[sliderLength]
      : sliderLength;
  }

  let newThumbSize = thumbSizeCatalog.hasOwnProperty(thumbSize)
    ? thumbSizeCatalog[thumbSize]
    : thumbSize;

  if (!defaultValue)
    defaultValue = thumbs === 2 ? [minValue, maxValue] : minValue;

  let trackRef = useCombinedRefs(ref);

  let numberFormatter = useNumberFormatter(formatOptions);

  let state = useSliderState({
    ...props,
    numberFormatter,
    minValue,
    maxValue,
    defaultValue,
    step,
  });

  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef,
  );

  let mods = {
    horizontal: state.orientation === 'horizontal',
    vertical: state.orientation === 'vertical',
    disabled: isDisabled,
  };
  if (isDisabled) {
    state.setThumbEditable(0, false);
    if (thumbs === 2) state.setThumbEditable(1, false);
  }

  return (
    <SliderWrapper
      {...groupProps}
      {...filterBaseProps(props)}
      mods={mods}
      styles={props.styles}
      labelPosition={labelPosition}
    >
      {props.label && (
        <LabelContainer
          mods={mods}
          // styles={{
          //   paddingInline: parseInt(newThumbSize.replace(/px/, '')) / 2 + 'px',
          // for aligning label with slider  }}
        >
          <label {...labelProps}>{props.label}</label>
        </LabelContainer>
      )}
      <WithOutputs
        thumbs={thumbs}
        state={state}
        mods={mods}
        withoutOutputs={!showOutputs}
        {...outputProps}
      >
        <Track
          {...trackProps}
          mods={mods}
          ref={trackRef}
          sliderOrientation={state.orientation}
          sliderLength={sliderLength}
          thumbSize={newThumbSize}
          minValue={minValue}
          maxValue={maxValue}
          step={step}
          theme={theme}
          fillPercentage={
            thumbs === 1
              ? [0, state.getThumbPercent(0)]
              : [state.getThumbPercent(0), state.getThumbPercent(1)]
          }
          discrete={discrete}
        >
          <SliderThumb
            index={0}
            state={state}
            trackRef={trackRef}
            thumbSize={newThumbSize}
            icon={thumbIcon}
            theme={theme}
          />
          {thumbs === 2 ? (
            <SliderThumb
              index={1}
              state={state}
              trackRef={trackRef}
              thumbSize={newThumbSize}
              theme={theme}
            />
          ) : null}
        </Track>
      </WithOutputs>
    </SliderWrapper>
  );
});
export default BaseSlider;
