import { useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { useUserSettings } from 'renderer/features/common/hooks/userSettings';
import {
  initializeTasks,
  QueryKeys,
  getAllAccounts,
  getUserConfig,
} from 'renderer/services';

export function useNodeInitialization() {
  const queryClient = useQueryClient();
  const { settings, loadingSettings } = useUserSettings();
  const initializeNodeCalled = useRef(false);

  const prefetchQueries = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: [QueryKeys.UserSettings],
          queryFn: getUserConfig,
        }),
        queryClient.prefetchQuery({
          queryKey: [QueryKeys.Accounts],
          queryFn: getAllAccounts,
        }),
      ]);
    } catch (error: any) {
      console.error(error);
    }
  }, [queryClient]);

  const initializeNode = async () => {
    if (initializeNodeCalled.current) {
      return;
    }
    initializeNodeCalled.current = true;
    console.log('Initializing node...');
    try {
      await prefetchQueries();
      await initializeTasks();
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const { isLoading: initializingNode, error: nodeInitializationError } =
    useQuery([QueryKeys.InitializingNode], initializeNode, {
      enabled: !!settings?.hasFinishedEmergencyMigration && !loadingSettings,

      retry: 3,
      cacheTime: 0,
      staleTime: Infinity,
    });

  return {
    initializingNode,
    nodeSettings: settings,
    nodeInitializationError,
  };
}
