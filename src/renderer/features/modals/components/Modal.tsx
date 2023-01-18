import React from 'react';

type PropsType = {
  children: React.ReactNode;
};

export const Modal: React.FC<PropsType> = ({ children }) => {
  return (
    <div className="absolute top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black bg-opacity-40">
      <div className="relative rounded-md shadow-lg">{children}</div>
    </div>
  );
};
