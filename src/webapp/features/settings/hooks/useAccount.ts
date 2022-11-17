import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { QueryKeys, removeAccount, setActiveAccount } from 'webapp/services';

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
  } = useMutation(removeAccount, {
    onSuccess: () => {
      queryCache.invalidateQueries(QueryKeys.Accounts);
    },
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
