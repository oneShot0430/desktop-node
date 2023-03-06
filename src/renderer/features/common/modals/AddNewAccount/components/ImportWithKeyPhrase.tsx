import { Icon, UploadLine, CloseLine } from '@_koii/koii-styleguide';
import React, { memo, useState } from 'react';
import { useQueryClient } from 'react-query';

import {
  AccountsType,
  ImportFromSeedPhrase,
} from 'renderer/components/ImportFromSeedPhrase';
import { ModalContent } from 'renderer/features/modals';
import { Theme } from 'renderer/types/common';

type PropsType = Readonly<{
  onClose: () => void;
  onImportSuccess: (keys: AccountsType) => void;
}>;

function ImportWithKeyPhrase({ onClose, onImportSuccess }: PropsType) {
  const queryCache = useQueryClient();

  const [accountName, setAccountName] = useState('');

  return (
    <ModalContent theme={Theme.Dark} className="w-fit h-fit">
      <div className="text-white ">
        <div className="flex justify-between p-3">
          <div className="flex items-center justify-between gap-6 pl-6">
            <Icon source={UploadLine} className="w-7 h-7" />
            <span className="text-[24px]">
              Import a key with a secret phrase
            </span>
          </div>
          <Icon
            source={CloseLine}
            className="w-8 h-8 cursor-pointer"
            onClick={onClose}
          />
          {/*  not sure */}
        </div>

        <div className="flex items-center justify-center w-full p-4">
          <input
            className="w-[360px] px-6 py-2 rounded-md bg-finnieBlue-light-tertiary focus:ring-2 focus:ring-finnieTeal focus:outline-none text-sm focus:bg-finnieBlue-light-secondary"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account name"
          />
        </div>

        <ImportFromSeedPhrase
          /**
           * @todo: add account name from input field
           */
          accountName={accountName}
          onImportSuccess={({ stakingAccountPubKey, mainAccountPubKey }) => {
            queryCache.invalidateQueries();
            onImportSuccess({ stakingAccountPubKey, mainAccountPubKey });
          }}
          confirmActionLabel="Import Account"
          className="px-8 bg-finnieBlue-light-4"
        />
      </div>
    </ModalContent>
  );
}

export default memo(ImportWithKeyPhrase);