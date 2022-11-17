import React, { memo, useState } from 'react';
import { useQueryClient } from 'react-query';

import UploadIcon from 'assets/svgs/upload-icon.svg';
import CloseIconWhite from 'svgs/close-icons/close-icon-white.svg';
import { ImportFromSeedPhrase } from 'webapp/components/ImportFromSeedPhrase';
import { ModalContent } from 'webapp/features/modals';
import { Theme } from 'webapp/types/common';

type PropsType = Readonly<{
  onClose: () => void;
  onImportSuccess: (keys: {
    stakingAccountPubKey: string;
    mainAccountPubKey: string;
  }) => void;
}>;

const ImportWithKeyPhrase = ({ onClose, onImportSuccess }: PropsType) => {
  const queryCache = useQueryClient();

  const [accountName, setAccountName] = useState('');

  return (
    <ModalContent theme={Theme.Dark} className="w-fit h-fit">
      <div className="text-white ">
        <div className="flex justify-between p-3">
          <div className="flex items-center justify-between pl-6">
            <UploadIcon />
            <span className="text-[24px]">
              Import a key with a secret phrase
            </span>
          </div>

          <CloseIconWhite className="w-[32px] h-[32px]" onClick={onClose} />
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
            console.log('@@@keys', { stakingAccountPubKey, mainAccountPubKey });
            queryCache.invalidateQueries();
            onImportSuccess({ stakingAccountPubKey, mainAccountPubKey });
          }}
          confirmActionLabel={'Import Account'}
          className="px-[30px] bg-finnieBlue-light-4"
        />
      </div>
    </ModalContent>
  );
};

export default memo(ImportWithKeyPhrase);
