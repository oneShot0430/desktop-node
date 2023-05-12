import { Buffer } from 'buffer';

import NiceModal from '@ebay/nice-modal-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import './App.css';
import '@_koii/koii-styleguide/dist/style.css';
import 'tailwindcss/tailwind.css';

import AppProvider from 'renderer/Providers/AppProvider';

import { NotificationsProvider } from './features/notifications';
import AppRoutes from './routing/AppRoutes';

const queryClient = new QueryClient();

function App(): JSX.Element {
  // TODO(Chris): check properly if ok to remove it
  window.Buffer = Buffer;
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <NiceModal.Provider>
          <NotificationsProvider>
            <AppRoutes />
          </NotificationsProvider>
        </NiceModal.Provider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
