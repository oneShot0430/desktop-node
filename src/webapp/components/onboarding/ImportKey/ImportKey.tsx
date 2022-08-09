import React from 'react';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';

const ImportKey = () => {
  const handleImportSuccess = (seedPhrase: string) => {
    console.log('###seedPhrase', seedPhrase);
  };

  return (
    <div className="mt-[140px] flex flex-col items-start pl-[100px]">
      <div className="text-lg pl-[42px] mb-10">
        Type in your secret phrase to import your key.
      </div>
      <ImportFromSeedPhrase
        onImportSuccess={handleImportSuccess}
        confirmActionLabel="Confirm"
      />
    </div>
  );
};

export default ImportKey;
