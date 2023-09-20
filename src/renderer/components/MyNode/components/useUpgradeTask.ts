import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { RequirementType } from 'models';
import { useMetadata, useTaskStake } from 'renderer/features';
import {
  QueryKeys,
  TaskService,
  getTaskPairedVariablesNamesWithLabels,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getKoiiFromRoe } from 'utils';

export enum UpgradeStatus {
  UP_TO_DATE = 'UP_TO_DATE',
  AVAILABLE = 'AVAILABLE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  IS_CONFIRMING_UPGRADE = 'IS_CONFIRMING_UPGRADE',
  IN_PROGRESS = 'IN_PROGRESS',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export const useUpgradeTask = (task: Task) => {
  const initialStatus = task.isMigrated
    ? UpgradeStatus.AVAILABLE
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
      const newerTask = {
        ...newerTaskState,
        publicKey: newTaskState.migratedTo,
      };
      return newerTask;
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
    data: newTaskVersionPairedVariables,
    isLoading: isLoadingNewTaskVersionPairedVariables,
  } = useQuery(
    [QueryKeys.StoredTaskPairedTaskVariables, newTaskVersion?.publicKey || ''],
    () => getTaskPairedVariablesNamesWithLabels(newTaskVersion?.publicKey || '')
  );

  const {
    metadata: newTaskVersionMetadata,
    isLoadingMetadata: isLoadingNewTaskVersionMetadata,
  } = useMetadata({
    metadataCID: newTaskVersion?.metadataCID,
  });

  const newTaskVersionVariables = (
    newTaskVersionMetadata?.requirementsTags?.filter(({ type }) =>
      [RequirementType.TASK_VARIABLE, RequirementType.GLOBAL_VARIABLE].includes(
        type
      )
    ) || []
  ).map(({ value }) => ({ name: value || '', label: 'ㅤ' }));

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
    nodes: newTaskVersionNodes,
    minStake: newTaskVersionMinStake,
    topStake: getKoiiFromRoe(newTaskVersionTopStake),
    bounty: newTaskVersionTotalBountyInKoii,
  };

  useEffect(() => {
    if (
      task.isMigrated &&
      newTaskVersion &&
      upgradeStatus === UpgradeStatus.UP_TO_DATE
    ) {
      setUpgradeStatus(UpgradeStatus.AVAILABLE);
    }
  }, [task.isMigrated, newTaskVersion, upgradeStatus]);

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
    upgradeStatus,
    setUpgradeStatus,
    upgradeTask,
    newTaskVersion,
    isLoadingNewTaskVersion,
    newTaskVersionMetadata,
    isLoadingNewTaskVersionMetadata,
    newTaskVersionVariables,
    newTaskVersionPairedVariables,
    isLoadingNewTaskVersionPairedVariables,
    newTaskVersionDetails,
    newTaskVersionStake,
  };
};
