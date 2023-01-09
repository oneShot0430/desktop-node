import { Icon, SettingsLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { TaskVariableData } from 'models/api';
import { Button } from 'webapp/components';
import { Modal, ModalContent, ModalTopBar } from 'webapp/features/modals';
import {
  deleteTaskVariable as deleteTaskVariableService,
  QueryKeys,
} from 'webapp/services';
import { Theme } from 'webapp/types/common';

interface Params {
  taskVariableLabel: TaskVariableData['label'];
}

export const DeleteTaskVariable = create<Params>(function DeleteTaskVariable({
  taskVariableLabel,
}) {
  const queryClient = useQueryClient();

  const { mutate: deleteTaskVariable } = useMutation(
    deleteTaskVariableService,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TaskVariables]);
      },
    }
  );

  const modal = useModal();

  const handleClose = () => {
    modal.resolve();
    modal.remove();
  };

  const handleConfirm = () => {
    deleteTaskVariable(taskVariableLabel);
    handleClose();
  };

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="pt-1 pb-3.5 pl-8 pr-1 w-fit h-fit text-white rounded min-w-[620px]"
      >
        <ModalTopBar
          theme="dark"
          title={
            <div className="flex items-center justify-start gap-4 -ml-6">
              <Icon source={SettingsLine} className="h-8 w-8" />
              Delete Task Setting
            </div>
          }
          titleClasses="w-full"
          onClose={handleClose}
        />

        <div className="px-4 pb-10 text-left text-sm leading-10">
          <span> Are you sure you want to delete Task Setting </span>
          <span className="font-black">{taskVariableLabel}</span>? This
          procedure cannot be undone and it will cause the tasks that are
          running on this tool to stop.
        </div>
        <div className="flex items-center justify-center gap-6 text-finnieBlue-light-secondary">
          <Button label="Keep" onClick={handleClose} className="bg-white" />
          <Button
            label="Delete"
            onClick={handleConfirm}
            className="bg-finnieRed"
          />
        </div>
      </ModalContent>
    </Modal>
  );
});
