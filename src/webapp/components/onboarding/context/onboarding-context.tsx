import React, { createContext, useState } from 'react';

const OnboardingContext = createContext<
  | {
      systemKey: string;
      newSeedPhrase: string;
      setNewSeedPhrase: React.Dispatch<React.SetStateAction<string>>;
      setSystemKey: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

type PropsType = {
  children: React.ReactNode;
};

function OnboardingProvider({ children }: PropsType) {
  const [systemKey, setSystemKey] = useState<string>(null);
  const [newSeedPhrase, setNewSeedPhrase] = useState<string>(null);

  const value = { systemKey, setSystemKey, newSeedPhrase, setNewSeedPhrase };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export { OnboardingContext, OnboardingProvider };
