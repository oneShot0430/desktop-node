import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { AppRoute } from 'webapp/routing/AppRoutes';

const ImportKey = () => {
  const navigate = useNavigate();
  const handleImportSuccess = (seedPhrase: string) => {
    console.log('###seedPhrase', seedPhrase);
    navigate(AppRoute.OnboardingPhraseImportSuccess);
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
