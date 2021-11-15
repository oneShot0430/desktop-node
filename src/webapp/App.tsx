import React from 'react';

import MainLayout from './components/MainLayout';
import MyNode from './pages/MyNode';

const App = (): JSX.Element => {
  return (
    <MainLayout>
      <MyNode />
    </MainLayout>
  );
};

export default App;
