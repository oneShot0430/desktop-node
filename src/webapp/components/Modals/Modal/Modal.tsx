import React, { useRef } from 'react';

import { useAppSelector } from 'webapp/hooks/reduxHook';

const Modal = (): JSX.Element => {
  const isOpen = useAppSelector((state) => state.modal.isShown);

  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {isOpen && (
        <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
          <div ref={modalRef} className="relative rounded-md shadow-lg">
            haha
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
