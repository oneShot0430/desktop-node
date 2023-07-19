import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { RequirementType, TaskMetadata } from 'models';
import { Modal, ModalContent, ModalTopBar } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

export type TaskMetadataModalPropsType = {
  metadata?: TaskMetadata | null | undefined;
};

export const TaskMetadataModal = create<TaskMetadataModalPropsType>(
  function TaskDetailsModal({ metadata }) {
    const modal = useModal();
    const NOT_AVAILABLE = '-';
    const specs = metadata?.requirementsTags?.filter(({ type }) =>
      [
        RequirementType.CPU,
        RequirementType.RAM,
        RequirementType.STORAGE,
        RequirementType.ARCHITECTURE,
        RequirementType.OS,
        RequirementType.NETWORK,
      ].includes(type)
    );

    const handleClose = () => {
      modal.remove();
    };

    const gridClass = twMerge('grid grid-cols-2 gap-y-2 text-white text-sm');
    const taskSpecificationClass = twMerge('w-full text-start');

    return (
      <Modal>
        <ModalContent theme={Theme.Dark}>
          <ModalTopBar
            title="Task Metadata"
            onClose={handleClose}
            theme="dark"
          />
          <div className="flex flex-col w-full gap-4 pl-3 pr-5 mt-4">
            <div className="text-start">
              <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
                Description
              </div>
              <p className="mb-4 text-sm text-white select-tex">
                {metadata?.description ?? NOT_AVAILABLE}
              </p>
            </div>

            <div className="flex justify-between w-full mb-6 text-start">
              <div className={taskSpecificationClass}>
                <div className="mb-2 text-base font-semibold text-finnieEmerald-light">
                  Specifications
                </div>
                <div className={gridClass}>
                  {specs?.map(({ type, value }, index) => (
                    <div key={index} className="select-text">
                      {type}: {value ?? NOT_AVAILABLE}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    );
  }
);
