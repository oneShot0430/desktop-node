import React, { useState } from 'react';

import { CreateNewSecret } from './components/CreateNewSecret/CreateNewSecret';
import { SecretsTable } from './components/SecretsTable';

const secretsDataMock = [
  {
    name: 'secret1',
    value: 'value1',
  },
  {
    name: 'secret2',
    value: 'value2',
  },
  {
    name: 'secret3',
    value: 'value3',
  },
  {
    name: 'secret4',
    value: 'value4',
  },
];

export const Secrets = () => {
  const [createMode, setCreateMode] = useState<boolean>();

  const handleSwitchToCreateMode = () => {
    setCreateMode(true);
  };

  const handleSwitchToViewMode = () => {
    setCreateMode(false);
  };

  return (
    <div data-testid="secrets" className="h-full">
      {createMode ? (
        <CreateNewSecret onBackButtonClick={handleSwitchToViewMode} />
      ) : (
        <SecretsTable
          secrets={secretsDataMock}
          onCreateClick={handleSwitchToCreateMode}
        />
      )}
    </div>
  );
};
