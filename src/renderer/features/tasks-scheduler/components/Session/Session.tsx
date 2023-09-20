import { CheckSuccessLine, CloseLine } from '@_koii/koii-styleguide';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import {
  ScheduleMetadata,
  ScheduleMetadataUpdateType,
  TimeFormat,
} from 'models';
import { Button, Tooltip } from 'renderer/components/ui';
import { updateSessionById } from 'renderer/services';

import { getErrorToDisplay } from '../../../../utils';
import { defaultSessionId } from '../../constants';
import { getTimeUntilScheduleStarts } from '../../utils';
import { TimePicker } from '../TimePicker';
import { ToggleScheduleSwitch } from '../ToggleScheduleSwitch';
import { WeekDaySelect } from '../WeekDaysSelect';

type PropsType = {
  scheduleMetadata: ScheduleMetadata;
  disabled: boolean;
  onRemoveSessionClick: (sessionId: string) => void;
};

export function Session({
  scheduleMetadata,
  disabled,
  onRemoveSessionClick,
}: PropsType) {
  const [showStopTimer, setShowStopTimer] = useState<boolean>(
    !!scheduleMetadata.stopTime
  );
  const [schedule, setSchedule] = useState<ScheduleMetadataUpdateType>(
    scheduleMetadata || {
      startTime: '00:00:00',
      stopTime: '00:00:00',
      days: [],
      isEnabled: false,
    }
  );

  const [hasError, setHasError] = useState(false);

  const updateSession = useCallback(
    (scheduleData: ScheduleMetadataUpdateType) => {
      setHasError(false);
      updateSessionById(scheduleData)
        .then(() => {
          const timeTillNextStart = getTimeUntilScheduleStarts(
            scheduleData.startTime as TimeFormat,
            scheduleData.days || []
          );

          toast.success(
            scheduleData.isEnabled
              ? `This session will begin in ${timeTillNextStart}.`
              : 'Session updated.',
            {
              duration: 4500,
              icon: <CheckSuccessLine className="w-5 h-5" />,
              style: {
                backgroundColor: '#BEF0ED',
                paddingRight: 0,
                maxWidth: '100%',
              },
            }
          );
        })
        .catch((error: any) => {
          console.error(error);
          const errorMessage = getErrorToDisplay(error);
          if (errorMessage) {
            setHasError(true);
            toast.error(errorMessage, {
              duration: 4500,
              icon: <CloseLine className="w-5 h-5" />,
              style: {
                backgroundColor: '#FFA6A6',
                paddingRight: 0,
                maxWidth: '100%',
              },
            });
          }
        });
    },
    [setHasError]
  );

  const handleStartTimeChange = useCallback(
    (value: TimeFormat) => {
      const changedSchedule = {
        ...schedule,
        startTime: value,
      };
      setSchedule(changedSchedule);

      updateSession(changedSchedule);
    },
    [schedule, updateSession]
  );

  const handleStopTimeChange = useCallback(
    (value: TimeFormat) => {
      const changedSchedule = {
        ...schedule,
        stopTime: value,
      };
      setSchedule(changedSchedule);

      updateSession(changedSchedule);
    },
    [schedule, updateSession]
  );

  const handleSelectedDaysChange = useCallback(
    (value: number[]) => {
      const changedSchedule = {
        ...schedule,
        days: value,
      };

      setSchedule(changedSchedule);

      updateSession(changedSchedule);
    },
    [schedule, updateSession]
  );

  const handleRemoveSchedule = () => {
    if (scheduleMetadata.id) {
      onRemoveSessionClick(scheduleMetadata.id);
    }
  };

  const handleScheduleToggle = (value: boolean) => {
    const changedSchedule = {
      ...schedule,
      isEnabled: value,
    };
    setSchedule(changedSchedule);

    updateSession(changedSchedule);
  };

  const handleHideStopTimer = () => {
    setShowStopTimer(false);

    const changedSchedule = {
      ...schedule,
      stopTime: null,
    };
    setSchedule(changedSchedule);

    updateSession(changedSchedule);
  };

  const handleAddStopTimer = () => {
    setShowStopTimer(true);
  };

  const disableClasses =
    (disabled && 'opacity-50 cursor-not-allowed pointer-events-none') || '';

  const wrapperClasses = twMerge(
    'flex items-center w-full gap-10 p-4 rounded-lg bg-finnieBlue-light-transparent justify-between border-2 border-transparent',
    disableClasses,
    hasError && 'border-finnieRed focus:border-finnieRed'
  );

  const displaySessionRemoveButton = scheduleMetadata.id !== defaultSessionId;

  return (
    <Tooltip
      forceHide={!disabled}
      placement="top-left"
      tooltipContent='Set your node to "Stay Awake" to use this feature'
      customTooltipWrapperClass="right-10 -top-[15px]"
    >
      <div className="flex items-center w-">
        <div className={wrapperClasses}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <TimePicker
                label="Start"
                onTimeChange={handleStartTimeChange}
                defaultValue={scheduleMetadata.startTime}
              />
              {showStopTimer ? (
                <TimePicker
                  label="Stop"
                  onTimeChange={handleStopTimeChange}
                  defaultValue={scheduleMetadata.stopTime || '00:00:00'}
                  onHide={handleHideStopTimer}
                />
              ) : (
                <div className="pb-2 mt-7">
                  <Button
                    label="Add stop time"
                    onClick={handleAddStopTimer}
                    className="text-white underline rounded-md bg-purple-light-transparent underline-offset-2 h-9 w-[180px] hover:text-green-2"
                  />
                </div>
              )}
            </div>
            <WeekDaySelect
              sessionId={scheduleMetadata.id}
              onSelectedDaysChange={handleSelectedDaysChange}
              defaultValue={scheduleMetadata.days}
            />
          </div>

          <div className="pr-6">
            <ToggleScheduleSwitch
              sessionId={scheduleMetadata.id}
              onToggle={handleScheduleToggle}
              defaultValue={scheduleMetadata.isEnabled}
              disabled={hasError}
            />
          </div>
        </div>
        <div
          role="button"
          className={`p-2 w-5 ${disableClasses}`}
          tabIndex={0}
          onClick={handleRemoveSchedule}
          onKeyDown={(e) => e.key === 'Enter' && handleRemoveSchedule()}
        >
          {displaySessionRemoveButton && (
            <CloseLine className="w-5 h-5 text-white cursor-pointer" />
          )}
        </div>
      </div>
    </Tooltip>
  );
}
