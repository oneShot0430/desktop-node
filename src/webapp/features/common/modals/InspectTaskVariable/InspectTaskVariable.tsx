import { Icon, CloseLine, BrowseInternetLine } from '@_koii/koii-styleguide';
import { create, useModal } from '@ebay/nice-modal-react';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TaskVariableDataWithId } from 'models/api';
import { Button, LoadingSpinner } from 'webapp/components';
import { Modal, ModalContent } from 'webapp/features/modals';
import { getTasksPairedWithVariable, QueryKeys } from 'webapp/services';
import { Theme } from 'webapp/types/common';
import { AppRoute } from 'webapp/types/routes';

interface Params {
  taskVariable: TaskVariableDataWithId;
}

export const InspectTaskVariable = create<Params>(function InspectTaskVariable({
  taskVariable: { label, value, id },
}) {
  const modal = useModal();

  const navigate = useNavigate();

  const handleSeeAllTasks = () => {
    modal.remove();
    navigate(AppRoute.MyNode);
  };

  const {
    data: tasksPairedWithVariable = [],
    isLoading: isLoadingTasksPaired,
  } = useQuery([QueryKeys.TasksPairedWithVariable, id], () =>
    getTasksPairedWithVariable(id)
  );

  return (
    <Modal>
      <ModalContent
        theme={Theme.Dark}
        className="text-left p-5 pl-10 w-max h-fit rounded text-white flex flex-col gap-4 w-[840px]"
      >
        <div className="w-full flex justify-center items-center gap-4 text-2xl font-semibold pt-2">
          <Icon source={BrowseInternetLine} className="h-8 w-8" />
          <span>View Task Setting Info</span>
          <Icon
            source={CloseLine}
            className="h-8 w-8 ml-auto cursor-pointer"
            onClick={modal.remove}
          />
        </div>

        <p className="mt-3 mb-6">
          This is placeholder for information about the tool, website, function,
          etc.
        </p>
        <div className="flex">
          <div className="flex flex-col flex-1 mb-2">
            <label className="mb-0.5 text-left">TOOL LABEL</label>

            <div className="px-6 py-2 mr-6 text-sm rounded-md bg-finnieBlue-light-tertiary">
              {label}
            </div>
          </div>

          <div className="flex flex-col flex-[2] mb-2">
            <label className="mb-0.5 text-left">TOOL KEY INPUT</label>

            <div className="px-6 py-2 mr-6 text-sm rounded-md bg-finnieBlue-light-tertiary">
              {value}
            </div>
          </div>
        </div>

        <label className="mb-0.5 text-left">TASKS USING THIS TOOL</label>

        <div className="flex flex-wrap gap-x-12">
          {isLoadingTasksPaired ? (
            <div className="mx-auto w-full">
              <LoadingSpinner />
            </div>
          ) : (
            tasksPairedWithVariable?.map(
              ({ publicKey, data: { taskName } }) => (
                <div key={publicKey} className="w-fit flex items-center gap-4">
                  <span className="h-2.5 w-2.5 bg-finnieTeal-100" />
                  <span>{taskName}</span>
                </div>
              )
            )
          )}
        </div>

        <Button
          label="See all Tasks"
          className="m-auto font-semibold bg-finnieGray-tertiary text-finnieBlue-light w-56 h-12"
          onClick={handleSeeAllTasks}
        />
      </ModalContent>
    </Modal>
  );
});
