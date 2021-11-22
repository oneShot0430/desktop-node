import React from 'react';

const ModalCreateTask = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center text-finnieBlue tracking-finnieSpacing-wider">
      <div className="text-2xl font-semibold  mb-2.5 leading-8">
        Create your own Koii Tasks
      </div>
      <div className="font-normal w-128 mb-6.25">
        The world’s information is at your fingertips with the power of the Koii
        Network.
      </div>
      <div className="font-semibold mb-1 leading-7">Are you a developer?</div>
      <div className="font-normal mb-2.5">
        Head over to the Koii SDK to learn how.
      </div>
      <div className="font-semibold mb-1 leading-7">Need a developer?</div>
      <div className="font-normal w-128">
        Check out our Discord server to find developers who are already familiar
        with Koii and creating Tasks.
      </div>
    </div>
  );
};

export default ModalCreateTask;
