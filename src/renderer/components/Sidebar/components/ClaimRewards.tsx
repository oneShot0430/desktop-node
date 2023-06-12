import {
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
  CheckSuccessLine,
  CloseLine,
} from '@_koii/koii-styleguide';
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import ShareIcon from 'assets/svgs/share-icon.svg';
import { ErrorType, GetTaskNodeInfoResponse } from 'models';
import { Tooltip, ErrorMessage, DotsLoader } from 'renderer/components/ui';
import {
  QueryKeys,
  claimRewards,
  fetchMyTasks,
  getStakingAccountPublicKey,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { Theme } from 'renderer/types/common';

interface PropsType {
  value: number;
  displayConfetti?: () => void;
  enableNodeInfoRefetch?: (value: boolean) => void;
}

export function ClaimRewards({
  value,
  displayConfetti,
  enableNodeInfoRefetch,
}: PropsType) {
  const tasksWithClaimableRewardsRef = useRef<number>(0);

  const [hasErrorClaimingRewards, setHasErrorClaimingRewards] =
    useState<boolean>(false);

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
  const handleFailure = () => {
    setHasErrorClaimingRewards(true);
    setTimeout(() => {
      setHasErrorClaimingRewards(false);
    }, 5500);
  };
  const handlePartialFailure = () => {
    toast.error(
      'Not all rewards were claimed successfully, please try again.',
      {
        duration: 1500,
        icon: <CloseLine className="h-5 w-5" />,
        style: {
          backgroundColor: '#FFA6A6',
          paddingRight: 0,
        },
      }
    );
  };

  const queryClient = useQueryClient();

  const { mutate: claimPendingRewards, isLoading: isClaimingRewards } =
    useMutation(claimRewards, {
      onSuccess: async () => {
        enableNodeInfoRefetch?.(false);
        queryClient.setQueryData<
          (oldNodeData: GetTaskNodeInfoResponse) => GetTaskNodeInfoResponse
        >([QueryKeys.taskNodeInfo], (oldNodeData: GetTaskNodeInfoResponse) => ({
          ...oldNodeData,
          pendingRewards: 0,
        }));

        queryClient.invalidateQueries([QueryKeys.taskList]);

        // lock Sidebar updates for 25sec
        setTimeout(() => {
          console.log('@@@ enableNodeInfoRefetch');
          enableNodeInfoRefetch?.(true);
          queryClient.invalidateQueries([QueryKeys.taskList]);
        }, 25000);

        displayConfetti?.();

        toast.success('Congrats! Your total KOII will be updated shortly.', {
          duration: 1500,
          icon: <CheckSuccessLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#BEF0ED',
            paddingRight: 0,
          },
        });
      },
      onError: (error: Error) => {
        const numberOfUnclaimedRewards = Number(error.message);
        const notAllRewardsWereClaimed =
          numberOfUnclaimedRewards < tasksWithClaimableRewardsRef.current;
        if (notAllRewardsWereClaimed) {
          handlePartialFailure();
        } else {
          handleFailure();
        }
      },
      retry: 3,
    });

  return (
    <div className="w-full ml-0.5 mb-1 flex justify-center mt-auto">
      {hasErrorClaimingRewards ? (
        <ErrorMessage
          error={ErrorType.GENERIC}
          className="text-xs text-center text-finnieRed"
        />
      ) : isClaimingRewards ? (
        <DotsLoader />
      ) : value ? (
        <Tooltip
          theme={Theme.Light}
          tooltipContent="Click here to claim all pending Task rewards."
        >
          <Button
            onClick={handleClickClaim}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.SM}
            label="Claim Rewards"
            labelClassesOverrides="text-sm"
            buttonClassesOverrides="!p-4 !border-white !text-white"
          />
        </Tooltip>
      ) : (
        <Tooltip
          theme={Theme.Light}
          tooltipContent="Run a few Tasks to earn rewards. Rewards are paid out after a Task is complete."
        >
          <div className="flex items-center w-full ml-1 -mb-1 text-sm text-white">
            Add a Task to Earn <Icon source={ShareIcon} className="w-8 h-8" />
          </div>
        </Tooltip>
      )}
    </div>
  );
}
