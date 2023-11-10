import { Buffer } from 'buffer';

import { CheckSuccessLine } from '@_koii/koii-styleguide';
import NiceModal from '@ebay/nice-modal-react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import './App.css';
import '@_koii/koii-styleguide/dist/style.css';
import 'tailwindcss/tailwind.css';

import ExclamationMarkIcon from 'assets/svgs/exclamation-mark-icon.svg';
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
            <Toaster
              toastOptions={{
                style: {
                  maxWidth: '100%',
                },
                className: 'px-4 text-sm text-[#171753]',
                duration: 4500,
                error: {
                  icon: <ExclamationMarkIcon className="w-6 h-6" />,
                  style: {
                    backgroundColor: '#FFA6A6',
                  },
                },
                success: {
                  icon: <CheckSuccessLine className="h-5 w-5" />,
                  style: {
                    backgroundColor: '#BEF0ED',
                  },
                },
              }}
            />
          </NotificationsProvider>
        </NiceModal.Provider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
