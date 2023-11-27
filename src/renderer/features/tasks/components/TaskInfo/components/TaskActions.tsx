import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import Archive from 'assets/svgs/archive.svg';
import ExploreIcon from 'assets/svgs/explore-icon.svg';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import { LoadingSpinner } from 'renderer/components/ui';
import useArchive from 'renderer/features/common/hooks/useArchive';

import { Address } from '../../AvailableTaskRow/components/Address';
import { TurnSchedulerOnOffOnTask } from '../TurnSchedulerOnOffOnTask';

type PropsType = {
  publicKey: string;
  pendingRewards?: number;
  shouldDisplayArchiveButton?: boolean;
  showSourceCode?: boolean;
  repositoryUrl?: string;
};

export function TaskActions({
  publicKey,
  pendingRewards,
  shouldDisplayArchiveButton,
  showSourceCode,
  repositoryUrl,
}: PropsType) {
  const { archiveTask, isArchivingTask } = useArchive({
    taskPublicKey: publicKey,
    pendingRewards,
  });

  return (
    <div className="flex flex-col items-end gap-2">
      <TurnSchedulerOnOffOnTask taskPublicKey={publicKey} />

      {showSourceCode && (
        <SourceCodeButton repositoryUrl={repositoryUrl ?? ''} />
      )}

      <Address
        address={publicKey}
        overrideLabel={
          <div className="flex gap-2">
            <Icon source={ExploreIcon} className="w-6 h-6" />
            <span>Explore history</span>
          </div>
        }
        className="select-text"
      />

      {shouldDisplayArchiveButton &&
        (isArchivingTask ? (
          <LoadingSpinner className="w-6 h-6 ml-auto" />
        ) : (
          <button
            className="flex gap-3 ml-auto text-right hover:underline"
            onClick={() => archiveTask()}
          >
            <Icon source={Archive} className="w-4 h-4" />
            Archive
          </button>
        ))}
    </div>
  );
}
