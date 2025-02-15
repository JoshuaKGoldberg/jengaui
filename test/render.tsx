import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

import { Root } from '@jengaui/root';

export function renderWithRoot(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries' | 'wrapper'>,
) {
  return render(ui, { ...options, wrapper: Root });
}

export * from '@testing-library/react';
