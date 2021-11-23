/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/export */
import { render as rtlRender, RenderResult } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import rootReducer from 'webapp/store/reducers';

export const render = (
  ui: any,
  {
    preloadedState,
    store = createStore(rootReducer, preloadedState),
    ...renderOptions
  }: Record<string, any> = {}
): RenderResult => {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return rtlRender(ui, {
    wrapper: Wrapper as React.FunctionComponent<unknown>,
    ...renderOptions,
  });
};

export * from '@testing-library/react';
export { rtlRender };
