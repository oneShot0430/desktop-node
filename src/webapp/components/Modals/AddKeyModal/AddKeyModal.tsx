import React, { memo, useEffect, useRef } from 'react';

import AddIcon from 'assets/svgs/add-icon-outlined.svg';
import UploadIcon from 'assets/svgs/upload-icon.svg';

import ModalContent from '../Modal/ModalContent';
import ModalTopBar from '../Modal/ModalTopBar';

import AddKeyAction from './components/AddKeyAction';

const AddKeyModal = ({ onClose }: { onClose: () => void }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log('#####ef.current', ref.current);
      ref.current.focus();
    }
  });

  return (
    <ModalContent theme="dark" className="w-[800px] h-[320px]">
      <ModalTopBar theme="dark" title={'Key Management'} onClose={onClose} />
      <div className="flex flex-col items-start gap-2 pl-12">
        <div className="text-xl font-semibold text-white">Add New Account</div>
        <AddKeyAction
          ref={ref}
          title="Import with a seed phrase"
          description="Import an existing wallet using a 12-word seed phrase"
          icon={<UploadIcon />}
        />

        <AddKeyAction
          title="Get a new key"
          description="Start from the beginning"
          icon={<AddIcon />}
        />
      </div>
    </ModalContent>
  );
};

export default memo(AddKeyModal);
