import NiceModal from '@ebay/nice-modal-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@_koii/koii-styleguide/dist/style.css';

const queryClient = new QueryClient();

import AppProvider from './Providers/AppProvider';
import AppRoutes from './routing/AppRoutes';

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <NiceModal.Provider>
          <AppRoutes />
        </NiceModal.Provider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
