import React from 'react';

type ToolbarProps = {
  logo: React.ElementType;
  title: string;
  rightPart: React.ReactNode;
};

const Toolbar = ({
  logo: Logo,
  title,
  rightPart,
}: ToolbarProps): JSX.Element => {
  return (
    <div className="h-34.5 bg-gradient-to-r from-finnieBlue-dark to-finnieBlue text-white pl-9.75 flex justify-between pr-8">
      <div className="pt-10 flex items-end mb-6.5">
        <Logo />
        <h1 className="tracking-finnieSpacing font-semibold text-2xl ml-6 mb-1">
          {title}
        </h1>
      </div>
      <div>{rightPart}</div>
    </div>
  );
};

export default Toolbar;
