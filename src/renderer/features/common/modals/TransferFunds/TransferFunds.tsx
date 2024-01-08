import { create, useModal } from '@ebay/nice-modal-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { Button, ErrorMessage } from 'renderer/components/ui';
import { useCloseWithEsc } from 'renderer/features/common/hooks/useCloseWithEsc';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import {
  getAccountBalance,
  transferKoiiFromMainWallet,
  transferKoiiFromStakingWallet,
} from 'renderer/services';
import { getKoiiFromRoe } from 'utils';

import KoiiInput from './KoiiInput';

type PropsType = {
  accountName: string;
  walletAddress: string;
  accountType: 'STAKING' | 'SYSTEM';
};

export const TransferFunds = create<PropsType>(function AddStake({
  accountName,
  walletAddress,
  accountType,
}) {
  const modal = useModal();

  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [destinationWallet, setDestinationWallet] = useState('');

  const sendTokensApiCall = async () => {
    const trimmedWallet = destinationWallet.trim();
    if (accountType === 'SYSTEM') {
      await transferKoiiFromMainWallet(accountName, amount, trimmedWallet);
    } else {
      await transferKoiiFromStakingWallet(accountName, amount, trimmedWallet);
    }
    console.log({ accountName });
  };

  const {
    mutate: sendTokens,
    isLoading: isSending,
    error: errorSending,
    isError,
  } = useMutation(sendTokensApiCall, {
    onSuccess: () => {
      handleClose();
    },
  });
  const getWalletAccountBalance = () => {
    return getAccountBalance(walletAddress).then((balanceInRoe) => {
      const balanceInKoii = getKoiiFromRoe(balanceInRoe);
      return balanceInKoii;
    });
  };
  const { data: balance = 0 } = useQuery(
    [walletAddress],
    getWalletAccountBalance
  );
  const queryClient = useQueryClient();

  const handleClose = () => {
    modal.resolve(true);
    modal.remove();
    // Forcing refetch of balances
    queryClient.invalidateQueries({
      queryKey: ['account-balance', walletAddress],
    });
  };

  useCloseWithEsc({ closeModal: handleClose });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const transferAmount = +e.target.value;
    if (transferAmount > balance) {
      setError('Not enough balance');
    }
    if (accountType === 'STAKING' && transferAmount > balance - 5) {
      setError(
        'You cannot withdraw all tokens, Need to have at least 5 tokens in staking account for rent fees'
      );
    }
    setAmount(transferAmount);
  };
  const handleDestinationWalletChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const destinationWalletVal = e.target.value;
    setDestinationWallet(destinationWalletVal);
  };

  const confirmSendTokens = () => sendTokens();

  return (
    <Modal>
      <ModalContent className="w-[700px]">
        <ModalTopBar title="Transfer Funds" onClose={handleClose} />
        <div className="flex flex-col items-center justify-center py-8 text-finnieBlue-dark gap-5 h-84">
          <div className="px-5">
            Enter the wallet address and amount below to transfer your tokens
            from this wallet.
          </div>
          <div className="flex flex-col mb-2 w-80">
            <label htmlFor="setting-label" className="mb-0.5 text-left">
              Destination Wallet
            </label>
            <div className="w-80 h-[46px] outline-none bg-gray-200 border-b-finnieBlue border-2 text-md text-right flex justify-between items-center inner focus-within:bg-white">
              <input
                className="w-full bg-gray-200 focus:bg-white focus:border-none focus:outline-none pl-2"
                type="text"
                value={destinationWallet}
                onChange={handleDestinationWalletChange}
                placeholder="Enter Destination wallet address"
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col w-80">
              <label htmlFor="setting-label" className="mb-0.5 text-left">
                Amount To Send
              </label>
            </div>
            <KoiiInput onInputChange={handleInputChange} />
            <div className="h-12 -mb-10 -mt-2 -pt-2 w-80">
              {(error || isError) && (
                <ErrorMessage error={error || (errorSending as Error)} />
              )}
            </div>
          </div>
          <div className="py-2 text-xs text-finnieTeal-700">
            {!error
              ? `${balance} KOII available in your balance`
              : '                   '}
          </div>
          <Button
            label="Send Tokens"
            onClick={confirmSendTokens}
            className="text-white py-5 mt-3"
            loading={isSending}
            disabled={!!error || !amount}
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
