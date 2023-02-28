import React, { createContext, useState } from 'react';

interface Context {
  systemKey: string | undefined;
  newSeedPhrase: string | undefined;
  accountName: string | undefined;
  setAccountName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setNewSeedPhrase: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSystemKey: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Ctx = createContext<Context | undefined>(undefined);

type PropsType = {
  children: React.ReactNode;
};

export function OnboardingProvider({ children }: PropsType) {
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

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboardingContext() {
  const context = React.useContext(Ctx);
  if (!context) {
    throw new Error(
      'useOnboardingContext must be used inside OnboardingProvider'
    );
  }
  return context;
}
