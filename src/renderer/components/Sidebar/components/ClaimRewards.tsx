import {
  Button,
  ButtonVariant,
  ButtonSize,
  Icon,
  CheckSuccessLine,
} from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';

import ShareIcon from 'assets/svgs/share-icon.svg';
import { ErrorType } from 'models';
import { Tooltip, ErrorMessage, DotsLoader } from 'renderer/components/ui';
import { QueryKeys, claimRewards } from 'renderer/services';
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
  const [hasErrorClaimingRewards, setHasErrorClaimingRewards] =
    useState<boolean>(false);

  const displayErrorTemporarily = () => {
    setHasErrorClaimingRewards(true);
    setTimeout(() => {
      setHasErrorClaimingRewards(false);
    }, 4000);
  };

  const queryClient = useQueryClient();

  const { mutate: claimPendingRewards, isLoading: isClaimingRewards } =
    useMutation(claimRewards, {
      onSuccess: async (rewardsNotClaimed) => {
        enableNodeInfoRefetch?.(false);
        queryClient.setQueryData(
          [QueryKeys.taskNodeInfo],
          (oldNodeData: any) => ({
            ...oldNodeData,
            pendingRewards: 0,
          })
        );
        queryClient.invalidateQueries([QueryKeys.taskList]);

        // lock Sidebar updates for 20sec
        setTimeout(() => {
          enableNodeInfoRefetch?.(true);
        }, 25000);

        displayConfetti?.();

        if (rewardsNotClaimed) {
          displayErrorTemporarily();
        }

        toast.success('Congrats! Your total KOII will be updated shortly.', {
          duration: 1500,
          icon: <CheckSuccessLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#BEF0ED',
            paddingRight: 0,
          },
        });
      },
      onError: displayErrorTemporarily,
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
            onClick={() => claimPendingRewards()}
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
