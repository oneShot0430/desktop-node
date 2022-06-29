import React, { useEffect, useState } from 'react';
import { useFilePicker } from 'use-file-picker';

import { Button } from 'webapp/components/ui/Button';

interface Props {
  taskId: string;
}

const PrimitiveOnboarding = ({ taskId }: Props): JSX.Element => {
  const [openFileSelector, { plainFiles }] = useFilePicker({
    accept: '.json',
    multiple: false,
  });

  const [isMainWalletSet, setIsMainWalletSet] = useState(false);
  const [mainWalletLoading, setMainWalletLoading] = useState(false);

  const [isStakingWalletSet, setIsStakingWalletSet] = useState(false);
  const [stakingWalletLoading, setStakingWalletLoading] = useState(false);

  const getPath = (): string | null => {
    if (plainFiles[0]) {
      return plainFiles[0].path;
    }
    return null;
  };

  const checkWalletExists = () => {
    setMainWalletLoading(true);
    setStakingWalletLoading(true);
    window.main
      .checkWalletExists()
      .then(({ mainSystemAccount, stakingWallet }) => {
        setIsMainWalletSet(mainSystemAccount);
        setIsStakingWalletSet(stakingWallet);
        setMainWalletLoading(false);
        setStakingWalletLoading(false);
      });
  };

  const storeMainWallet = () => {
    setMainWalletLoading(true);
    window.main.storeMainWallet({ walletPath: getPath() }).finally(() => {
      checkWalletExists();
      setMainWalletLoading(false);
    });
  };

  const generateStakingWallet = () => {
    setStakingWalletLoading(true);
    window.main.createStakingWallet().finally(() => {
      checkWalletExists();
      setStakingWalletLoading(false);
    });
  };

  useEffect(() => checkWalletExists(), []);

  return (
    <div className="flex justify-center gap-[20px]">
      <Button
        label="Select Keyfile"
        onClick={openFileSelector}
        disabled={mainWalletLoading || isMainWalletSet}
      />
      <Button
        label="Store Main Key"
        onClick={storeMainWallet}
        disabled={mainWalletLoading || isMainWalletSet || !getPath()}
      />
      <Button
        label="Generate Staking Key"
        onClick={generateStakingWallet}
        disabled={stakingWalletLoading || isStakingWalletSet}
      />
    </div>
  );
};

export default PrimitiveOnboarding;
