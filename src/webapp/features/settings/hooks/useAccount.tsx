import { useCallback } from 'react';
import { useQueryClient, useMutation } from 'react-query';

import { QueryKeys, removeAccount, setActiveAccount } from 'webapp/services';

export const useAccount = (accountName: string) => {
  const queryCache = useQueryClient();

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

  const removeAccountHandler = useCallback(() => {
    deleteAccount(accountName);
  }, [deleteAccount, accountName]);

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
