import { Icon } from '@_koii/koii-styleguide';
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import {
  stopAllTasks,
  startAllTasks,
  QueryKeys,
  getRunningTasksPubKeys,
} from 'renderer/services';

import { LoadingSpinner, Button, Tooltip } from '../ui';

import { Pause } from './Pause';
import { Play } from './Play';

export function StartStopAllTasks() {
  const queryCache = useQueryClient();

  const { data: runningTasksPubKeys } = useQuery(
    [QueryKeys.RunningTasksPubKeys],
    getRunningTasksPubKeys
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(
    runningTasksPubKeys?.length === 0
  );
  const handlePauseAllTasks = async () => {
    try {
      setIsLoading(true);
      if (runningTasksPubKeys?.length === 0) {
        startAllTasks();
      } else {
        stopAllTasks();
      }
    } catch (error) {
      console.warn(error);
    } finally {
      await queryCache.invalidateQueries();
    }
  };

  useEffect(() => {
    setShowPlayButton(runningTasksPubKeys?.length === 0);
    setIsLoading(false);
  }, [runningTasksPubKeys]);

  const tooltipContent = showPlayButton
    ? 'Play all tasks.'
    : 'Pause all tasks.';

  return (
    <div className="ml-2">
      {isLoading ? (
        <span className="flex items-center ">
          <LoadingSpinner />
        </span>
      ) : (
        <Tooltip tooltipContent={tooltipContent}>
          <Button
            onlyIcon
            icon={
              <Icon
                className="w-10 h-10 mb-[5px] text-white"
                color="#fff"
                source={showPlayButton ? Play : Pause}
                size={18}
              />
            }
            onClick={handlePauseAllTasks}
          />
        </Tooltip>
      )}
    </div>
  );
}
