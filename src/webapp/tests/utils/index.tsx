import NiceModal from '@ebay/nice-modal-react';
import {
  render as rtlRender,
  RenderResult,
  RenderOptions,
} from '@testing-library/react';
import React, { ReactElement, ReactNode, FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

const queryClient = new QueryClient();

interface WrapperProps {
  children: ReactNode;
}

export const render = (
  ui: ReactElement,
  renderOptions?: RenderOptions
): RenderResult => {
  const Wrapper: FunctionComponent<WrapperProps> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <NiceModal.Provider>{children}</NiceModal.Provider>
        </HashRouter>
      </QueryClientProvider>
    );
  };

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });
};
