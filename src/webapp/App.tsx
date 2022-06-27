import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

import AppProvider from './Providers/AppProvider';
import AppRoutes from './routing/AppRoutes';

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
