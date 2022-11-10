import React from 'react';

type PropsType = {
  children: React.ReactNode;
};

export const ContentRightWrapper = ({ children }: PropsType) => {
  return (
    <div className="relative z-50  mt-[160px] w-fit ml-[12vw]">{children}</div>
  );
};
