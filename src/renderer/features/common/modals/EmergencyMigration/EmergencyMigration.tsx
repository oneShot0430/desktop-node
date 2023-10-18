import { BrowseInternetLine, Button } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React, { useEffect } from 'react';
import { useMutation } from 'react-query';

import { LoadingSpinner } from 'renderer/components/ui';
import { Modal, ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

type PropsType = {
  migrationPhase: 1 | 2;
};

export const EmergencyMigration = create<PropsType>(
  function EmergencyMigration({ migrationPhase }) {
    const modal = useModal();

    const migrationPhaseToExecute =
      migrationPhase === 1
        ? window.main.startEmergencyMigration
        : window.main.finishEmergencyMigration;

    const {
      mutate: startEmergencyMigration,
      isLoading,
      isError: isMigrationError,
    } = useMutation(migrationPhaseToExecute, {
      retry: 5,
      onSuccess: () => {
        if (migrationPhase === 2) {
          modal.remove();
        }
      },
    });

    console.log({ isLoading, isMigrationError });

    useEffect(() => {
      startEmergencyMigration();
    }, [startEmergencyMigration]);

    const getLogs = () => window.main.openNodeLogfileFolder();
    const retryMigration = () => startEmergencyMigration();

    const title = isMigrationError
      ? 'Whoops! Something’s not quite right...'
      : 'Quick Upgrade';

    const text = isMigrationError
      ? 'An error occurred while upgrading your node. Please try again later.'
      : migrationPhase === 1
      ? "We're making some quick security upgrades. Your node will restart shortly."
      : 'Hang tight while we finalize this quick security upgrade. All features and rewards will be available in just a few moments';

    const bottomElement = isMigrationError ? (
      <div className="flex gap-5 mx-auto my-4">
        <Button
          label="Get Logs"
          onClick={getLogs}
          className="w-56 h-12 m-auto font-semibold text-white border border-white"
        />
        <Button
          label="Try again"
          onClick={retryMigration}
          className="w-56 h-12 m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light"
        />
      </div>
    ) : (
      <LoadingSpinner className="w-10 h-10 mx-auto mt-4" />
    );

    return (
      <Modal>
        <ModalContent
          theme={Theme.Dark}
          className="w-[600px] text-white py-6 px-8 flex flex-col gap-5 text-left font-light"
        >
          <div className="flex gap-5 pl-2">
            <BrowseInternetLine className="w-8 h-8" />
            <p className="text-2xl">{title}</p>
          </div>
          <p>{text}</p>
          {bottomElement}
        </ModalContent>
      </Modal>
    );
  }
);
