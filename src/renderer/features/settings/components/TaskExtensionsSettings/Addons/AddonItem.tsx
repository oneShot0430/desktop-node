import { Icon, SettingsLine, CheckSuccessLine } from '@_koii/koii-styleguide';
import React from 'react';
import { useMutation } from 'react-query';

import { Button } from 'renderer/components/ui';
import { useOrcaPodman } from 'renderer/features/orca/hooks';

const installAddonAPI = async (url: string) => {
  console.log({ url });
  await window.main.openBrowserWindow({ URL: url });
};

type PropsType = {
  name: string;
  description: string;
  logo?: any;
  url: string;
};

export function AddonItem({ name, description, logo, url }: PropsType) {
  const mutation = useMutation(() => installAddonAPI(url));
  const { data, loadingOrcaPodman, orcaPodmanError } = useOrcaPodman();
  console.log({ data, loadingOrcaPodman, orcaPodmanError });
  let isPodmanExists;
  let isOrcaVMRunning;
  if (data) {
    isPodmanExists = data.isPodmanExists;
    isOrcaVMRunning = data.isOrcaVMRunning;
  }
  console.log({ isPodmanExists, isOrcaVMRunning });

  const handleInstallAddon = () => {
    mutation.mutate();
  };

  return (
    <div>
      <div className="p-6 rounded-md bg-purple-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-2xl font-semibold text-left">
            {logo && <img width={130} height={130} src={logo} alt="Orca" />}
            <span>{name}</span>
          </div>
          {isPodmanExists ? (
            <Button
              label="Downloaded"
              icon={<Icon source={CheckSuccessLine} className="w-5" />}
              disabled={mutation.isLoading}
              className="font-semibold bg-white text-finnieBlue-light text-[14px] leading-[14px] min-w-[200px] h-9 self-end"
              loading={mutation.isLoading}
            />
          ) : (
            <Button
              label="Download Add-on"
              icon={<Icon source={SettingsLine} className="w-5" />}
              onClick={handleInstallAddon}
              disabled={mutation.isLoading}
              className="font-semibold bg-white text-finnieBlue-light text-[14px] leading-[14px] min-w-[200px] h-9 self-end"
              loading={mutation.isLoading}
            />
          )}
        </div>

        <div>{description}</div>
      </div>
    </div>
  );
}
