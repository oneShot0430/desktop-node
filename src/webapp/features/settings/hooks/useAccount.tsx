import React, { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { QueryKeys, removeAccount, setActiveAccount } from 'webapp/services';

import { useConfirmModal } from '../../common/modals/ConfirmationModal';

type ParamsType = {
  accountName: string;
  isDefault: boolean;
};

export const useAccount = ({ accountName, isDefault }: ParamsType) => {
  const queryCache = useQueryClient();
  const { showModal } = useConfirmModal({
    content: (
      <div className="py-20">
        Are you sure you want to remove the{' '}
        <span className="text-lg text-finnieTeal">{accountName}</span> account?
      </div>
    ),
    title: 'Delete Account',
  });

  const {
    mutate: deleteAccount,
    isLoading: removingAccountLoading,
    error: removingAccountError,
  } = useMutation(removeAccount, {
    onSuccess: () => queryCache.invalidateQueries(QueryKeys.Accounts),
  });

  const {
    mutate: setAccountActive,
    isLoading: setAccountActiveLoading,
    error: setAccountActiveError,
  } = useMutation(setActiveAccount, {
    onSuccess: () => queryCache.invalidateQueries(QueryKeys.Accounts),
  });

  const removeAccountHandler = useCallback(async () => {
    if (isDefault) {
      return;
    }

    const isConfirmed = await showModal();

    if (isConfirmed) {
      deleteAccount(accountName);
    }
  }, [isDefault, showModal, deleteAccount, accountName]);

  const setAccountActiveHandler = useCallback(() => {
    setAccountActive(accountName);
  }, [setAccountActive, accountName]);

  return {
    deleteAccount: removeAccountHandler,
    setAccountActive: setAccountActiveHandler,
    removingAccountLoading,
    removingAccountError,
    setAccountActiveLoading,
    setAccountActiveError,
  };
};
