import { useQuery } from 'react-query';

import { QueryKeys, getUserConfig } from 'renderer/services';

export const useUserSettings = () => {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery(QueryKeys.UserSettings, getUserConfig);

  return { settings, loadingSettings: isLoading, loadingSettingsError: error };
};
