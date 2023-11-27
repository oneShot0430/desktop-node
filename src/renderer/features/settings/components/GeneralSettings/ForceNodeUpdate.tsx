import React from 'react';
import { useMutation } from 'react-query';

import { downloadAppUpdate } from 'renderer/services';

import { useUpdateCheck } from '../../hooks';

export function ForceNodeUpdate() {
  const { checkForUpdates, isCheckingForTheUpdate, updateInfo } =
    useUpdateCheck();

  const mutation = useMutation(downloadAppUpdate);

  const [hasChecked, setHasChecked] = React.useState(false);

  const handleForceUpdate = async () => {
    setHasChecked(false);
    const updateInfo = await checkForUpdates();
    setHasChecked(true);

    if (!updateInfo) {
      console.log('No updates available.');
    }
  };

  return (
    <div>
      <button
        onClick={handleForceUpdate}
        className="mb-2 text-sm underline text-finnieRed underline-offset-2"
      >
        Force Node Upgrade
      </button>
      {mutation.isError ? (
        <div className="text-sm text-finnieRed">
          An error occurred: {JSON.stringify(mutation.error)}
        </div>
      ) : null}
      {isCheckingForTheUpdate ? (
        <div className="text-sm text-white">Checking for update...</div>
      ) : hasChecked && !updateInfo ? (
        <div className="text-sm text-white">No newer update available.</div>
      ) : hasChecked && updateInfo ? (
        <div className="text-sm text-white">
          Update to version {updateInfo.version} available!
        </div>
      ) : null}
      {mutation.isLoading ? (
        <div className="text-sm text-white">Updating...</div>
      ) : null}
    </div>
  );
}
