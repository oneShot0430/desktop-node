import { useQuery } from 'react-query';

import { QueryKeys, getTasksSchedulerSessions } from 'renderer/services';

export const useTaskSchedulers = () => {
  const { data, isLoading, error } = useQuery(
    [QueryKeys.SchedulerSessions],
    getTasksSchedulerSessions
  );
  return {
    schedulerSessions: data,
    loadingSchedulerSessions: isLoading,
    schedulerSessionsLoadingError: error,
  };
};
