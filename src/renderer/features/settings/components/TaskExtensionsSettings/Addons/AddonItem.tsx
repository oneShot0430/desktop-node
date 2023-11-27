import { Icon, SettingsLine } from '@_koii/koii-styleguide';
import React from 'react';
import { useMutation } from 'react-query';

import { Button } from 'renderer/components/ui';

// Mocked API call to install the addon.
const installAddonAPI = async (name: string) => {
  // TODO: Replace this with your actual API call.
  console.log(`Installing addon: ${name}`);
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};

type PropsType = {
  name: string;
  description: string;
  logo?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export function AddonItem({ name, description, logo }: PropsType) {
  const mutation = useMutation(() => installAddonAPI(name));

  const handleInstallAddon = () => {
    mutation.mutate();
  };

  return (
    <div>
      <div className="p-6 rounded-md bg-purple-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-2xl font-semibold text-left">
            {logo && <Icon width={56} height={56} source={logo} />}
            <span>{name}</span>
          </div>

          <Button
            label="Download Add-on"
            icon={<Icon source={SettingsLine} className="w-5" />}
            onClick={handleInstallAddon}
            disabled={mutation.isLoading}
            className="font-semibold bg-white text-finnieBlue-light text-[14px] leading-[14px] min-w-[200px] h-9 self-end"
            loading={mutation.isLoading}
          />
        </div>

        <div>{description}</div>
      </div>
    </div>
  );
}
