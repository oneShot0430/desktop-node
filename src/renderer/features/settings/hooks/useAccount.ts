import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { removeAccount, setActiveAccount } from 'renderer/services';

type ParamsType = {
  accountName: string;
  isDefault: boolean;
};

export const useAccount = ({ accountName, isDefault }: ParamsType) => {
  const queryCache = useQueryClient();

  const {
    mutateAsync: deleteAccount,
    isLoading: removingAccountLoading,
    error: removingAccountError,
  } = useMutation<boolean, Error, string>(removeAccount, {
    onSuccess: () => queryCache.invalidateQueries(),
  });

  const {
    mutate: setAccountActive,
    isLoading: setAccountActiveLoading,
    error: setAccountActiveError,
  } = useMutation<boolean, Error, string>(setActiveAccount, {
    onSuccess: () => queryCache.invalidateQueries(),
  });

  const removeAccountHandler = useCallback(async () => {
    if (isDefault) {
      return;
    }
    await deleteAccount(accountName);
  }, [isDefault, deleteAccount, accountName]);

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
