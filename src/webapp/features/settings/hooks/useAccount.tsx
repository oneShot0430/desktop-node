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
      <div className="flex justify-center px-4 py-10">
        <div className="text-left">
          <p>
            Are you sure you want to delete{' '}
            <span className="text-lg text-finnieTeal">{accountName}</span>?
          </p>
          <br></br>
          If you want to use this account in the future, you will <br /> need to
          import it again using the secret phrase.
        </div>
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
