import { useCallback } from 'react';
import { useMutation, useQuery } from 'react-query';

import { StoreUserConfigParam } from 'models/api';
import { getUserConfig, QueryKeys, saveUserConfig } from 'renderer/services';

type ParamsType = {
  onConfigSaveSuccess?: () => void;
};

export const useUserAppConfig = ({ onConfigSaveSuccess }: ParamsType) => {
  const {
    data: userConfig,
    isLoading: isUserConfigLoading,
    error: userConfigError,
  } = useQuery([QueryKeys.UserSettings], getUserConfig);

  const setUserAppConfig = useCallback(
    async (config: Partial<StoreUserConfigParam>) => {
      const currentUserConfig = (await getUserConfig()) || {};
      const newConfig: StoreUserConfigParam = {
        settings: {
          ...currentUserConfig,
          ...config.settings,
        },
      };

      saveUserConfig(newConfig);
    },
    []
  );

  const {
    mutate,
    isLoading: isSavingUserConfig,
    error: saveUserConfigError,
  } = useMutation(setUserAppConfig, {
    onSuccess: () => {
      onConfigSaveSuccess?.();
    },
  });

  const handleSaveUserAppConfig = useCallback(
    (config: Partial<StoreUserConfigParam>) => {
      mutate(config);
    },
    [mutate]
  );

  return {
    userConfig,
    handleSaveUserAppConfig,
    isUserConfigLoading,
    userConfigError,
    isSavingUserConfig,
    saveUserConfigError,
  };
};
