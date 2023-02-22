import React, { createContext, useState } from 'react';

const OnboardingContext = createContext<
  | {
      systemKey: string | undefined;
      newSeedPhrase: string | undefined;
      accountName: string | undefined;
      setAccountName: React.Dispatch<React.SetStateAction<string | undefined>>;
      setNewSeedPhrase: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
      setSystemKey: React.Dispatch<React.SetStateAction<string | undefined>>;
    }
  | undefined
>(undefined);

type PropsType = {
  children: React.ReactNode;
};

function OnboardingProvider({ children }: PropsType) {
  const [systemKey, setSystemKey] = useState<string>();
  const [accountName, setAccountName] = useState<string>();
  const [newSeedPhrase, setNewSeedPhrase] = useState<string>();

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    systemKey,
    setSystemKey,
    newSeedPhrase,
    setNewSeedPhrase,
    accountName,
    setAccountName,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export { OnboardingContext, OnboardingProvider };
