import React from 'react';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';

const App = (): JSX.Element => {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App;
