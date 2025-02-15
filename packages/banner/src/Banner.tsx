import {
  CheckOutlined,
  CloseOutlined,
  ExclamationOutlined,
  InfoOutlined,
} from '@ant-design/icons';
import { Action } from '@jengaui/button';
import { Card, JengaCardProps } from '@jengaui/card';
import { Block } from '@jengaui/core';
import THEMES from '@jengaui/core';
import { tasty } from 'tastycss';

export interface JengaBannerProps extends JengaCardProps {
  type?: 'success' | 'note' | 'danger';
  onClose?: () => void;
}

const BannerElement = tasty(Card, {
  role: 'region',
  styles: {
    display: 'grid',
    color: '#dark',
    padding: '.5x',
    shadow: '0 5px 15px #dark.10',
    border: false,
    margin: '1x bottom',
    radius: '1.5r',
    gridColumns: 'auto 1fr auto',
    placeItems: 'center start',
    gap: '2x',
    preset: 't3',

    Icon: {
      display: 'flex',
      radius: '1r',
      width: '5x',
      height: '5x',
      placeContent: 'center',
      placeItems: 'center',
      preset: 't2',
      color: {
        '': '#dark.75',
        ...Object.keys(THEMES).reduce((map, theme) => {
          map[`[data-theme="${theme}"]`] = THEMES[theme].color;

          return map;
        }, {}),
      },
      fill: {
        '': '#clear',
        ...Object.keys(THEMES).reduce((map, theme) => {
          map[`[data-theme="${theme}"]`] = THEMES[theme].fill;

          return map;
        }, {}),
      },
    },
  },
});

const CloseButton = tasty(Action, {
  styles: {
    color: { '': '#dark.75', hovered: '#purple' },
    width: '5x',
    height: '5x',
    label: 'Close',
  },
});

export function Banner(allProps: JengaBannerProps) {
  let { theme, type, children, onClose, ...props } = allProps;

  theme = theme || type || 'note';

  let Icon;

  switch (theme) {
    case 'success':
      Icon = CheckOutlined;
      break;
    case 'danger':
      Icon = ExclamationOutlined;
      break;
    default:
      Icon = InfoOutlined;
      break;
  }

  return (
    <BannerElement {...props} data-theme={theme}>
      <div data-element="Icon">
        <Icon />
      </div>
      <Block>{children}</Block>
      <CloseButton onPress={onClose}>
        <CloseOutlined />
      </CloseButton>
    </BannerElement>
  );
}
