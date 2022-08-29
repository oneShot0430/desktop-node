import QRCode from 'qrcode.react';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import CloseIconComponent from 'svgs/close-icons/close-icon-blue.svg';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { getMainAccountPublicKey } from 'webapp/services';

import { ModalContent } from '../Modals';
import { Button } from '../ui/Button';

type PropsType = {
  onClose: () => void;
  pubKey: string;
};

export const AddFunds = ({ onClose, pubKey }: PropsType) => {
  const navigate = useNavigate();
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );

  return (
    <ModalContent className="w-[416px] h-[416px] text-finnieBlue rounded-xl pt-2">
      <div className="flex justify-end pr-2">
        <CloseIconComponent
          data-testid="close-modal-button"
          onClick={() => {
            onClose();
            navigate(AppRoute.OnboardingSeeBalance);
          }}
          className="w-[18px] h-[18px] cursor-pointer z-20"
        />
      </div>

      <div className="flex flex-col items-center w-full h-full">
        <div className="mb-3 text-lg leading-8">
          Scan the QR code or copy the address to send tokens to your node
          account.
        </div>
        <QRCode value="https://reactjs.org/" renderAs="canvas" size={240} />
        <div className="mt-3 mb-2 text-xs select-text">{mainAccountPubKey}</div>
        <Button
          onClick={() => {
            onClose();
            navigate(AppRoute.OnboardingSeeBalance);
          }}
          label="copy"
          className="w-[72px] h-[24px] rounded-xl text-xs border border-finnieBlue bg-transparent text-finnieBlue-dark"
        />
      </div>
    </ModalContent>
  );
};
