import React, { memo, useCallback, useState } from 'react';

import BackIcon from 'svgs/back-icon-white.svg';

import { Button } from '../ui/Button';

import KeyManagementTable from './components/KeyManagementTable';
import NodeLogs from './components/NodeLogs';
import { AccountType } from './types';

const accountsMock: AccountType[] = [
  { name: 'Name', address: '12345xx', balance: 12345 },
];

const logsMock = `
#!/usr/bin/env node
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
const argv = yargs.help().argv;
for (const arg of PARSE_ARGS)
  if (argv[arg] !== undefined) process.env[arg] = argv[arg];

const { tools, arweave, Namespace } = require("./src/helpers");
const { verifyStake, setupWebServer, runPeriodic } = require("./src/service");

const GATEWAY_URL = "https://arweave.net/";
`;

enum Tab {
  KeyManagement = 'KeyManagement',
  NodeLogs = 'NodeLogs',
}

const Settings = () => {
  const [tab, setTab] = useState(Tab.KeyManagement);
  const handleBackButtonClick = () => {
    // TODO: navigate to previous page
  };

  const isActiveTab = useCallback(
    (tabName: Tab) => tab === tabName && 'border-finnieTeal border-b-4',
    [tab]
  );

  return (
    <div>
      <div className="flex items-center px-3 py-3 mb-6 text-white bg-finnieTeal bg-opacity-30 gap-7">
        <Button
          onlyIcon
          icon={<BackIcon className="cursor-pointer" />}
          onClick={handleBackButtonClick}
        />
        <div className="flex items-center gap-[109px]">
          <div
            className={`pb-[1px] ${isActiveTab(Tab.KeyManagement)}`}
            onClick={() => setTab(Tab.KeyManagement)}
          >
            Key Management
          </div>
          <div
            onClick={() => setTab(Tab.NodeLogs)}
            className={`pb-[1px] ${isActiveTab(Tab.NodeLogs)}`}
          >
            Node Logs
          </div>
        </div>
      </div>

      {tab === Tab.KeyManagement && (
        <KeyManagementTable accounts={accountsMock} />
      )}
      {tab === Tab.NodeLogs && <NodeLogs logs={logsMock} />}
    </div>
  );
};

export default memo(Settings);
