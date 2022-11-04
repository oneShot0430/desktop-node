import { useCallback, useEffect, useState } from 'react';

import { StoreUserConfigParam } from 'models/api';
import { getUserConfig, saveUserConfig } from 'webapp/services';

export const useUserAppConfig = () => {
  const [laoding, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userConfig, setUserConfig] = useState<StoreUserConfigParam | null>(
    null
  );

  const getUserAppConfig = useCallback(async () => {
    try {
      setLoading(true);
      return await getUserConfig();
    } catch (error) {
      console.log('Error while loading config: ', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserAppConfig().then((config) => {
      setUserConfig({ settings: config });
    });
  }, [getUserAppConfig]);

  const setUserAppConfig = useCallback(
    async (config: Partial<StoreUserConfigParam>) => {
      const newConfig: StoreUserConfigParam = {
        settings: {
          ...userConfig?.settings,
          ...config.settings,
        },
      };

      saveUserConfig(newConfig);
    },
    [userConfig]
  );

  return { getUserAppConfig, setUserAppConfig, userConfig, laoding, error };
};
