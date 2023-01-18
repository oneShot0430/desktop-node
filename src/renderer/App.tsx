import NiceModal from '@ebay/nice-modal-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@_koii/koii-styleguide/dist/style.css';

const queryClient = new QueryClient();

import { NotificationsProvider } from './features/notifications/context/notifications-context';
import AppProvider from 'renderer/Providers/AppProvider';
import AppRoutes from './routing/AppRoutes';

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <NiceModal.Provider>
          <NotificationsProvider>
            <AppRoutes />
            {/* <div>asdf</div> */}
          </NotificationsProvider>
        </NiceModal.Provider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
