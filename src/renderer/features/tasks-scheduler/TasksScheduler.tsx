import { CheckSuccessLine } from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

import { isNumber } from 'lodash';
import { TimeFormat } from 'models';
import { useUserAppConfig } from 'renderer/features/settings/hooks';
import {
  QueryKeys,
  addTasksSchedulerSession,
  removeTasksSchedulerSession,
} from 'renderer/services';

import { StayAwake } from '../settings/components/MainSettings/StayAwake';

import { AddSessionButton } from './components/AddSessionButton';
import { Session } from './components/Session/Session';
import { useDefaultSchedulerSession, useTaskSchedulers } from './hooks';

export function TasksScheduler() {
  const queryCache = useQueryClient();
  useDefaultSchedulerSession();

  const { userConfig } = useUserAppConfig({});
  const { schedulerSessions } = useTaskSchedulers();

  const handleAddSessionClick = useCallback(async () => {
    const defaultTimeString: TimeFormat = '00:00:00';

    const newSession = {
      startTime: defaultTimeString,
      stopTime: null,
      days: [],
      isEnabled: false,
    };

    try {
      await addTasksSchedulerSession(newSession);
    } catch (error) {
      console.error('Failed to add new scheduler session: ', error);
      toast.error('Failed to add new scheduler session');
    } finally {
      queryCache.invalidateQueries([QueryKeys.SchedulerSessions]);
    }
  }, [queryCache]);

  const handleRemoveSessionClick = useCallback(
    async (sessionId: string) => {
      try {
        await removeTasksSchedulerSession(sessionId);
        toast.success('Session removed.', {
          duration: 4500,
          icon: <CheckSuccessLine className="w-5 h-5" />,
          style: {
            backgroundColor: '#BEF0ED',
            paddingRight: 0,
            maxWidth: '100%',
          },
        });
      } catch (error) {
        console.error('Failed to remove scheduler session: ', error);
        toast.error('Failed to remove scheduler session');
      } finally {
        queryCache.invalidateQueries([QueryKeys.SchedulerSessions]);
      }
    },
    [queryCache]
  );

  const isStayAwakeEnabled = isNumber(userConfig?.stayAwake);

  const sessions = schedulerSessions ?? [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="mb-4 text-xl font-semibold text-white">
          Schedule your Node’s work
        </div>
        <div className="flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md bg-purple-light-transparent mr-9">
          <span>Stay Awake</span>
          <StayAwake />
        </div>
      </div>

      <div className="mb-5 text-sm leading-6 text-white">
        Set it and forget it to earn tokens while you sleep!
        <br /> Schedule your node to run while you’re away from your computer.
        That way if you forget to turn it on, you won’t miss out.
      </div>

      <div className="mb-2">
        <div className="mb-3 text-base font-semibold text-finnieEmerald-light">
          Select the time and days of the week.
        </div>
        <div className="flex flex-col gap-4">
          {sessions?.map((session) => (
            <Session
              scheduleMetadata={session}
              key={session.id}
              disabled={!isStayAwakeEnabled}
              onRemoveSessionClick={handleRemoveSessionClick}
            />
          ))}
        </div>
      </div>

      <AddSessionButton onClick={handleAddSessionClick} />
    </div>
  );
}
