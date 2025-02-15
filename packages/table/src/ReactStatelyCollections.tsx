import { ColumnProps, CellProps, RowProps } from '@react-stately/table';
import { Styles } from 'tastycss';
import { Column as _Column } from '@react-stately/table';
import { Cell as _Cell } from '@react-stately/table';
import { Row as _Row } from '@react-stately/table';
import { TableBody as _TableBody } from '@react-stately/table';
import { TableHeader as _TableHeader } from '@react-stately/table';
export const TableHeader = _TableHeader;
export const TableBody = _TableBody;
export const Row = _Row as (
  props: RowProps & {
    align?: 'left' | 'center' | 'right';
    styles?: Styles;
  },
) => JSX.Element;
export const Column = _Column as <T>(
  props: ColumnProps<T> & {
    align?: 'left' | 'center' | 'right';
    dataType?: 'generic' | 'numeric' | 'date';
    styles?: Styles;
    colCellStyles?: Styles;
  },
) => JSX.Element;

export const AligmentFromDTCatalog = {
  generic: 'left',
  numeric: 'right',
  date: 'right',
};

export const Cell = _Cell as (
  props: CellProps & { styles?: Styles },
) => JSX.Element;
