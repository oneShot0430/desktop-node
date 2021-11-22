import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import AppRoutes from './AppRoutes';
import store from './store';

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </Provider>
  );
};

export default App;
