import { CheckSuccessLine, CloseLine } from '@_koii/koii-styleguide';
import React, { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { NODE_INFO_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { GetTaskNodeInfoResponse } from 'models';
import {
  useFundNewAccountModal,
  useMyNodeContext,
  useUserAppConfig,
} from 'renderer/features';
import {
  AppNotification,
  NotificationPlacement,
  useNotificationsContext,
} from 'renderer/features/notifications';
import {
  QueryKeys,
  getTaskNodeInfo,
  fetchMyTasks,
  claimRewards,
  getStakingAccountPublicKey,
  getRunningTasksPubKeys,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { AppRoute } from 'renderer/types/routes';

import { RewardsState } from '../types';

import { usePreviousRewards } from './usePreviousRewards';

const SIDEBAR_AND_MY_NODE_REFETCH_ENABLE_TIMEOUT = 25000;
const CLAIM_REWARDS_RETRY_VALUE = 10;

export const useSidebraLogic = () => {
  const queryClient = useQueryClient();
  const { setFetchMyTasksEnabled } = useMyNodeContext();
  const { addNotification } = useNotificationsContext();
  const { handleSaveUserAppConfig, refetchUserConfig } = useUserAppConfig({});
  const tasksWithClaimableRewardsRef = useRef<number>(0);

  const [enableNodeInfoRefetch, setEnableNodeInfoRefetch] = useState(true);

  const { showModal: showFundModal } = useFundNewAccountModal();
  const navigate = useNavigate();
  const location = useLocation();

  const showFirstNodeRewardNotification = async () => {
    const { data } = await refetchUserConfig();

    if (data) {
      const { firstRewardNotificationDisplayed } = data;
      if (!firstRewardNotificationDisplayed) {
        addNotification(
          'firstNodeReward',
          AppNotification.FirstNodeReward,
          NotificationPlacement.TopBar
        );
        handleSaveUserAppConfig({
          settings: {
            firstRewardNotificationDisplayed: true,
          },
        });
      }
    }
  };

  const { data: runningTasksPubKeys } = useQuery(
    [QueryKeys.RunningTasksPubKeys],
    getRunningTasksPubKeys
  );

  const { data: nodeInfoData } = useQuery(
    [QueryKeys.taskNodeInfo],
    getTaskNodeInfo,
    {
      enabled: enableNodeInfoRefetch,
      refetchInterval: NODE_INFO_REFETCH_INTERVAL,
      onSettled: (nodeInfo) => {
        if ((nodeInfo?.pendingRewards as number) > 0) {
          showFirstNodeRewardNotification();
        }
      },
    }
  );

  const { newRewardsAvailable } = usePreviousRewards(
    nodeInfoData?.pendingRewards
  );

  const navigateToMyNode = () => navigate(AppRoute.MyNode);
  const navigateToAvailableTasks = () => navigate(AppRoute.AddTask);

  const handleAddFundsClick = () => {
    showFundModal();
  };

  const isAddTaskView = useMemo(
    () => location.pathname === AppRoute.AddTask,
    [location.pathname]
  );

  const isRewardClaimable = useMemo(
    () => !!nodeInfoData?.pendingRewards,
    [nodeInfoData?.pendingRewards]
  );

  const handleClickClaim = async () => {
    const stakingAccountPublicKey = await getStakingAccountPublicKey();
    const getPendingRewardsByTask = (task: Task) =>
      task.availableBalances[stakingAccountPublicKey];
    const tasks = (await fetchMyTasks({ limit: Infinity, offset: 0 })).content;
    const tasksWithClaimableRewards = tasks.filter(getPendingRewardsByTask);
    // We need to set a ref to later compare to the number of rewards that were actually claimed, because with each request's retry the
    // number of tasks with rewards to claim could change and we need to compare it with the initial number of them
    tasksWithClaimableRewardsRef.current = tasksWithClaimableRewards.length;
    claimPendingRewards();
  };

  const enableRefecthingSidebarAndMyNode = () => {
    setTimeout(() => {
      setEnableNodeInfoRefetch?.(true);
      setFetchMyTasksEnabled(true);
    }, SIDEBAR_AND_MY_NODE_REFETCH_ENABLE_TIMEOUT);
  };

  const handleFailure = () => {
    toast.error('Something went wrong. Please try again.', {
      duration: 4500,
      icon: <CloseLine className="w-5 h-5" />,
      style: {
        backgroundColor: '#FFA6A6',
        paddingRight: 0,
      },
    });
  };

  const handlePartialFailure = () => {
    enableRefecthingSidebarAndMyNode();
    toast.error(
      'Not all rewards were claimed successfully, please try again.',
      {
        duration: 4500,
        icon: <CloseLine className="w-5 h-5" />,
        style: {
          backgroundColor: '#FFA6A6',
          paddingRight: 0,
        },
      }
    );
  };

  const handleSuccess = () => {
    setEnableNodeInfoRefetch?.(false);
    queryClient.setQueryData<
      (oldNodeData: GetTaskNodeInfoResponse) => GetTaskNodeInfoResponse
    >([QueryKeys.taskNodeInfo], (oldNodeData: GetTaskNodeInfoResponse) => ({
      ...oldNodeData,
      pendingRewards: 0,
    }));
    enableRefecthingSidebarAndMyNode();
    toast.success('Congrats! Your totals will be updated shortly.', {
      duration: 4500,
      icon: <CheckSuccessLine className="w-5 h-5" />,
      style: {
        backgroundColor: '#BEF0ED',
        paddingRight: 0,
      },
    });
  };

  const { mutate: claimPendingRewards, isLoading: isClaimingRewards } =
    useMutation(claimRewards, {
      onMutate: () => {
        setFetchMyTasksEnabled(false);
      },
      onSuccess: handleSuccess,
      onError: (error: Error) => {
        const tasksWithUnclaimedRewards = Number(error.message);
        const notAllRewardsWereClaimed =
          tasksWithUnclaimedRewards < tasksWithClaimableRewardsRef.current;

        if (notAllRewardsWereClaimed) {
          handlePartialFailure();
        } else {
          handleFailure();
        }
      },
      retry: CLAIM_REWARDS_RETRY_VALUE,
    });

  const handleSecondaryActionClick = () => {
    if (isAddTaskView) {
      navigateToMyNode();
    } else {
      navigateToAvailableTasks();
    }
  };

  const getRewardsInfoBoxState = () => {
    if (runningTasksPubKeys?.length === 0) {
      return RewardsState.NoRunningTasks;
    }

    if (newRewardsAvailable) {
      return RewardsState.RewardReceived;
    }

    return RewardsState.TimeToNextReward;
  };

  const rewardsInfoBoxState = getRewardsInfoBoxState();

  return {
    nodeInfoData,
    rewardsInfoBoxState,
    isClaimingRewards,
    isAddTaskView,
    isRewardClaimable,
    handleClickClaim,
    handleAddFundsClick,
    handleSecondaryActionClick,
    navigateToMyNode,
    navigateToAvailableTasks,
  };
};
