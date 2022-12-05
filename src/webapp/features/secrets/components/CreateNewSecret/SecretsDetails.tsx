import React from 'react';

import EditIconSvg from 'assets/svgs/edit-icon.svg';
import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import { Button } from 'webapp/components';
import { SourceCode } from 'webapp/components/SourceCode';
import { Task } from 'webapp/types';

import { useShowEnterSecretModal } from '../../modals/useShowEnterSecretModal';

type PropsType = {
  task: Task;
};

export const SecretsDetails = ({ task }: PropsType) => {
  const { showModal } = useShowEnterSecretModal({ secretKeyName: 'test' });
  const handleSecretEnter = () => {
    showModal().then((data) => {
      /**
       * @todo: handle secret here
       */
      console.log('secret entered', data);
    });
  };

  return (
    <div className="flex flex-col h-[58vh] py-3 text-xs rounded bg-finnieBlue-light-secondary">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <KeyIconSvg />
          </div>
          <div className="flex flex-col gap-2">
            <div>{task.taskName}</div>
            <div className="text-finnieTeal-100">{task.taskManager}</div>
          </div>
        </div>

        <div className="pr-10">
          <Button
            onClick={handleSecretEnter}
            icon={<EditIconSvg />}
            label="Enter Secret"
            className="text-sm font-semibold bg-finnieGray-light text-purple-3"
          />
        </div>
      </div>

      <div className="overflow-y-auto text-finnieTeal-100">
        {/**
         * @todo: get real code from task
         */}
        <SourceCode sourceCode={mockedCode} />
      </div>
    </div>
  );
};

const mockedCode = `
Instructions go here, step by step,
require("dotenv").config();
const prompts = require("prompts");
const kohaku = require("@_koi/kohaku");
const axios = require("axios");

// Parse cli params
const PARSE_ARGS = [
  "REDIS_IP",
  "REDIS_PORT",
  "AR_WALLET",
  "NODE_MODE",
  "STAKE",
  "SERVICE_URL",
  "TRUSTED_SERVICE_URL",
  "SERVER_PORT",
  "TASKS",
  "RESTORE_KOHAKU"
];
let yargs = require("yargs");
for (const arg of PARSE_ARGS) yargs = yargs.option(arg, { type: "string" });
`;
