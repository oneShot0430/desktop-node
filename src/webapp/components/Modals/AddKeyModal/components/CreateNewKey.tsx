import React, { memo } from 'react';

import { ModalContent } from '../../Modal';
import { Steps } from '../AddKeyModal';

type PropsType = Readonly<{
  onClose: () => void;
  setNextStep: (step: Steps) => void;
}>;

const CreateNewKey = ({ onClose }: PropsType) => {
  return (
    <ModalContent theme="dark" className="w-[800px] h-[320px]">
      <div>CreateNewKey</div>
    </ModalContent>
  );
};

export default memo(CreateNewKey);
