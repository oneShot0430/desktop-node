/* eslint-disable @cspell/spellchecker */
import { trackEvent } from '@aptabase/electron/renderer';

export const archiveTask = async (taskPubKey: string) => {
  trackEvent('task_archive', { taskPublicKey: taskPubKey });
  return window.main.archiveTask({ taskPubKey });
};

export const getIsTaskRunning = async (taskPublicKey: string) => {
  return window.main.getIsTaskRunning({ taskPublicKey });
};

export const getStartedTasksPubKeys = async () => {
  return window.main.getStartedTasksPubKeys();
};

export const getRunningTasksPubKeys = async () => {
  return window.main.getRunningTasksPubKeys();
};
