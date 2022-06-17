import React from 'react';

import ReportTaskIcon from 'svgs/flag-icon.svg';
import ShareLinkIcon from 'svgs/share-link-icon.svg';

type SourceCodeViewProps = {
  taskName: string;
  openReportView: () => void;
};

const SourceCodeView = ({
  taskName,
  openReportView,
}: SourceCodeViewProps): JSX.Element => {
  window.main
    .getTaskInfo({
      taskStatePublicKey: 'DEXm1P3rVRZT9EqBfupBmpbJpo2noUKapfSRSwEPSSYm',
    })
    .then(console.log);
  return (
    <>
      <div className="relative flex font-semibold mb-4">
        <ReportTaskIcon
          onClick={openReportView}
          className="absolute top-1 -left-6.25 w-2.5 h-3.5 cursor-pointer"
        />
        <div className="text-white">Inspect</div>
        <div className="text-finnieEmerald">&nbsp;{taskName}&nbsp;</div>
        <div className="text-white">Source Code</div>
        <ShareLinkIcon className="w-3.5 h-3.25 absolute -right-6 top-1 cursor-pointer" />
      </div>
      <div className="w-full text-finnieEmerald whitespace-pre-wrap break-words text-left max-h-116 text-2xs leading-4 tracking-finnieSpacing-wider font-roboto font-normal overflow-y-scroll">
        {`
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

const { tools, arweave, Namespace } = require("./src/helpers");
const { verifyStake, setupWebServer, runPeriodic } = require("./src/service")

let yargs = require("yargs");

for (const arg of PARSE_ARGS) yargs = yargs.option(arg, { type: "string" });

const argv = yargs.help().argv;

for (const arg of PARSE_ARGS)
if (argv[arg] !== undefined) process.env[arg] = argv[arg];`}
      </div>
    </>
  );
};

export default SourceCodeView;
