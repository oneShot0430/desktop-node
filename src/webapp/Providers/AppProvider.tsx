import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import store from 'webapp/store';

const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <Provider store={store}>
      <HashRouter>{children}</HashRouter>
    </Provider>
  );
};

export default AppProvider;
