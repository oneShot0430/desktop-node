import { Icon, SettingsLine, CloseLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { TaskVariableDataWithId } from 'models/api';
import { Button } from 'webapp/components/ui';
import { Modal, ModalContent } from 'webapp/features/modals';
import {
  deleteTaskVariable as deleteTaskVariableService,
  QueryKeys,
} from 'webapp/services';
import { Theme } from 'webapp/types/common';

interface Params {
  taskVariable: TaskVariableDataWithId;
}

export const DeleteTaskVariable = create<Params>(function DeleteTaskVariable({
  taskVariable: { id, label },
}) {
  const queryClient = useQueryClient();

  const { mutate: deleteTaskVariable } = useMutation(
    deleteTaskVariableService,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.TaskVariables]);
        queryClient.invalidateQueries([
          QueryKeys.StoredTaskPairedTaskVariables,
        ]);
      },
    }
  );

  const modal = useModal();

  const handleClose = () => {
    modal.resolve();
    modal.remove();
  };

  const handleConfirm = () => {
    deleteTaskVariable(id);
    handleClose();
  };

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="p-5 pl-10 w-fit h-fit text-white rounded min-w-[740px]"
      >
        <div className="flex items-center justify-center w-full gap-4 pt-2 text-2xl font-semibold">
          <Icon source={SettingsLine} className="w-8 h-8" />
          <span>Delete Task Setting</span>
          <Icon
            source={CloseLine}
            className="w-8 h-8 ml-auto cursor-pointer"
            onClick={modal.remove}
          />
        </div>

        <div className="py-10 leading-8 text-left pr-14">
          <span> Are you sure you want to delete Task Setting </span>
          <span className="font-black">{label}</span>? This procedure cannot be
          undone and it will cause the tasks that are running on this tool to
          stop.
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
