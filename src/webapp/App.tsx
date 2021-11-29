import React from 'react';

import AppRoutes from './AppRoutes';
import AppProvider from './providers/AppProvider';

const App = (): JSX.Element => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
