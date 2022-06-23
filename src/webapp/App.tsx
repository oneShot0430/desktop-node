import React from 'react';

import AppProvider from './Providers/AppProvider';
import AppRoutes from './routing/AppRoutes';

const App = (): JSX.Element => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
