import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { RequirementType } from 'models';
import {
  useAllStoredPairedTaskVariables,
  useMetadata,
  useTaskStake,
  useUserAppConfig,
} from 'renderer/features';
import {
  AppNotification,
  NotificationPlacement,
  useNotificationsContext,
} from 'renderer/features/notifications';
import {
  QueryKeys,
  TaskService,
  getTaskPairedVariablesNamesWithLabels,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getKoiiFromRoe } from 'utils';

export enum UpgradeStatus {
  UP_TO_DATE = 'UP_TO_DATE',
  UPGRADE_AVAILABLE = 'UPGRADE_AVAILABLE',
  PRIVATE_UPGRADE_AVAILABLE = 'PRIVATE_UPGRADE_AVAILABLE',
  PRIVATE_UPGRADE_WARNING = 'PRIVATE_UPGRADE_WARNING',
  NEW_VERSION_BEING_AUDITED = 'NEW_VERSION_BEING_AUDITED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IS_CONFIRMING_UPGRADE = 'IS_CONFIRMING_UPGRADE',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

interface Params {
  task: Task;
  oldTaskIsPrivate: boolean;
  oldTaskIsCoolingDown: boolean;
}

export const useUpgradeTask = ({
  task,
  oldTaskIsPrivate,
  oldTaskIsCoolingDown,
}: Params) => {
  const initialStatus = task.isMigrated
    ? UpgradeStatus.UPGRADE_AVAILABLE
    : UpgradeStatus.UP_TO_DATE;
  const [upgradeStatus, setUpgradeStatus] =
    useState<UpgradeStatus>(initialStatus);

  const queryClient = useQueryClient();

  const getLatestActiveVersionOfTask = async (
    taskPublicKey: string
  ): Promise<Task> => {
    const newTaskState = await window.main.getTaskInfo({
      taskAccountPubKey: taskPublicKey,
    });
    if (newTaskState.isActive) {
      console.log(`UPGRADE TASK: the new version ${taskPublicKey} is active`);
      const newTask = { ...newTaskState, publicKey: taskPublicKey };
      return newTask;
    } else if (newTaskState.isMigrated) {
      console.log(
        `UPGRADE TASK: task ${taskPublicKey} has been migrated to ${newTaskState.migratedTo}`
      );
      const newerTaskState = await getLatestActiveVersionOfTask(
        newTaskState.migratedTo
      );

      return newerTaskState;
    } else {
      console.log(
        `UPGRADE TASK: the latest version of the task ${taskPublicKey} is not active`
      );
      throw new Error('The latest version of this task is not active');
    }
  };

  const { data: newTaskVersion, isLoading: isLoadingNewTaskVersion } = useQuery(
    [QueryKeys.NewTaskVersion, task.publicKey],
    () => getLatestActiveVersionOfTask(task.migratedTo),
    {
      enabled: task.isMigrated,
    }
  );

  const {
    storedPairedTaskVariablesQuery: {
      data: allPairedVariables = {},
      isLoading: isLoadingNewTaskVersionPairedVariables,
    },
  } = useAllStoredPairedTaskVariables();

  const newTaskVersionPairedVariables = Object.entries(
    Object.entries(allPairedVariables).filter(
      ([taskId]) => taskId === newTaskVersion?.publicKey
    )[0]?.[1] || {}
  ).map(([key, value]) => ({ [key]: value }));

  const {
    data: newTaskVersionPairedVariablesWithLabel = [],
    // isLoading: isLoadingNewTaskVersionPairedVariables,
  } = useQuery(
    [QueryKeys.StoredTaskPairedTaskVariables, newTaskVersion?.publicKey],
    () =>
      getTaskPairedVariablesNamesWithLabels(newTaskVersion?.publicKey || ''),
    { enabled: !!newTaskVersion?.publicKey }
  );

  const {
    metadata: newTaskVersionMetadata,
    isLoadingMetadata: isLoadingNewTaskVersionMetadata,
  } = useMetadata({
    metadataCID: newTaskVersion?.metadataCID,
    queryOptions: { enabled: !!newTaskVersion },
  });

  const newTaskVersionVariables = (
    newTaskVersionMetadata?.requirementsTags?.filter(({ type }) =>
      [RequirementType.TASK_VARIABLE, RequirementType.GLOBAL_VARIABLE].includes(
        type
      )
    ) || []
  ).map(({ value, type, retrievalInfo }) => ({
    name: value || '',
    value: value || '',
    type: type || '',
    retrievalInfo,
    label: 'ㅤ',
  }));

  const { taskStake: newTaskVersionStake } = useTaskStake({
    task: newTaskVersion,
    publicKey: newTaskVersion?.publicKey,
  });
  const newTaskVersionNodes = useMemo(
    () => TaskService.getNodesCount(newTaskVersion!),
    [newTaskVersion]
  );
  const newTaskVersionTopStake = useMemo(
    () => TaskService.getTopStake(newTaskVersion!),
    [newTaskVersion]
  );
  const newTaskVersionTotalBountyInKoii = getKoiiFromRoe(
    newTaskVersion?.totalBountyAmount || 0
  );
  const newTaskVersionMinStake = getKoiiFromRoe(
    newTaskVersion?.minimumStakeAmount || 0
  );
  const newTaskVersionDetails = {
    nodesNumber: newTaskVersionNodes,
    minStake: newTaskVersionMinStake,
    topStake: getKoiiFromRoe(newTaskVersionTopStake),
    bounty: newTaskVersionTotalBountyInKoii,
  };

  const { addNotification } = useNotificationsContext();

  const { handleSaveUserAppConfig, userConfig } = useUserAppConfig({});

  const handleNotifyUpgradeAvailable = useCallback(() => {
    const taskIsReadyToUpgrade =
      !oldTaskIsCoolingDown &&
      newTaskVersion &&
      [
        UpgradeStatus.UPGRADE_AVAILABLE,
        UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE,
      ].includes(upgradeStatus);

    if (!taskIsReadyToUpgrade) return;

    const tasksThatAlreadyNotifiedUpgradesAvailable =
      userConfig?.tasksThatAlreadyNotifiedUpgradesAvailable || [];
    const hasNotified = tasksThatAlreadyNotifiedUpgradesAvailable.includes(
      newTaskVersion?.publicKey || ''
    );
    const shoulNotNotify = hasNotified || !userConfig;

    if (shoulNotNotify) return;

    const registerTaskUpgradeAsNotified = () =>
      handleSaveUserAppConfig({
        settings: {
          tasksThatAlreadyNotifiedUpgradesAvailable: [
            ...tasksThatAlreadyNotifiedUpgradesAvailable,
            newTaskVersion.publicKey,
          ],
        },
      });

    const onClickBannerCTA = () => {
      const newUpgradeStatus = newTaskVersion.isWhitelisted
        ? UpgradeStatus.IS_CONFIRMING_UPGRADE
        : UpgradeStatus.PRIVATE_UPGRADE_WARNING;
      setUpgradeStatus(newUpgradeStatus);
      registerTaskUpgradeAsNotified();
    };

    addNotification(
      `taskUpgradeNotification ${task.publicKey}}`,
      AppNotification.TaskUpgradeNotification,
      NotificationPlacement.TopBar,
      {
        taskName: task.taskName,
        ctaButtonAction: onClickBannerCTA,
        closeButtonAction: registerTaskUpgradeAsNotified,
      }
    );
  }, [
    oldTaskIsCoolingDown,
    upgradeStatus,
    handleSaveUserAppConfig,
    userConfig,
    newTaskVersion,
    addNotification,
    task.publicKey,
    task.taskName,
  ]);

  useEffect(() => {
    handleNotifyUpgradeAvailable();
  }, [handleNotifyUpgradeAvailable]);

  useEffect(() => {
    if (
      task.isMigrated &&
      newTaskVersion &&
      upgradeStatus === UpgradeStatus.UP_TO_DATE
    ) {
      setUpgradeStatus(UpgradeStatus.UPGRADE_AVAILABLE);
    }
  }, [task.isMigrated, newTaskVersion, upgradeStatus]);

  useEffect(() => {
    const newTaskVersionIsPrivate = newTaskVersion?.isWhitelisted === false;
    if (newTaskVersionIsPrivate) {
      const newUpgradeStatus = oldTaskIsPrivate
        ? UpgradeStatus.PRIVATE_UPGRADE_AVAILABLE
        : UpgradeStatus.NEW_VERSION_BEING_AUDITED;
      setUpgradeStatus(newUpgradeStatus);
    }
  }, [newTaskVersion?.isWhitelisted, oldTaskIsPrivate]);

  const { mutate: upgradeTask } = useMutation(
    (newStake: number) => {
      const stakeInKoii = getKoiiFromRoe(newStake);
      return window.main.upgradeTask({
        oldPublicKey: task.publicKey,
        newPublicKey: newTaskVersion?.publicKey || '',
        newStake: stakeInKoii,
      });
    },
    {
      onMutate: () => {
        setUpgradeStatus(UpgradeStatus.IN_PROGRESS);
      },
      onSuccess: () => {
        toast.success('Task upgraded successfully');
        setUpgradeStatus(UpgradeStatus.SUCCESS);

        setTimeout(() => {
          queryClient.invalidateQueries([QueryKeys.taskList]);
        }, 5000);
      },
      onError: () => {
        toast.error('Task upgrade failed');
        setUpgradeStatus(UpgradeStatus.ERROR);
      },
      retry: 3,
    }
  );

  return {
    upgradeStatus: newTaskVersion ? upgradeStatus : UpgradeStatus.UP_TO_DATE,
    setUpgradeStatus,
    upgradeTask,
    newTaskVersion,
    isLoadingNewTaskVersion,
    newTaskVersionMetadata,
    isLoadingNewTaskVersionMetadata,
    newTaskVersionVariables,
    newTaskVersionPairedVariables,
    newTaskVersionPairedVariablesWithLabel,
    isLoadingNewTaskVersionPairedVariables,
    newTaskVersionDetails,
    newTaskVersionStake,
  };
};
