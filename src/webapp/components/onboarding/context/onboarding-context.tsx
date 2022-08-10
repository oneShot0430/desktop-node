import React, { createContext, useState } from 'react';

const OnboardingContext = createContext<
  | {
      systemKey: string;
      setSystemKey: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

type PropsType = {
  children: React.ReactNode;
};

function OnboardingProvider({ children }: PropsType) {
  const [systemKey, setSystemKey] = useState<string>(null);

  const value = { systemKey, setSystemKey };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export { OnboardingContext, OnboardingProvider };
