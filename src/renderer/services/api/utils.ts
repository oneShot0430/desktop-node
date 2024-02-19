import axios from 'axios';

import { FAUCET_API_URL } from 'config/faucet';
import { Task as TaskRaw } from 'models';
import { Task } from 'renderer/types';

/** Utils */
export function parseTask({ data, publicKey }: TaskRaw): Task {
  return { publicKey, ...data };
}

export const getLogs = async (taskAccountPubKey: string, noOfLines = 500) => {
  const logs = await window.main.getTaskLogs({
    taskAccountPubKey,
    noOfLines,
  });
  console.log('--------------- NODE LOGS ----------------');
  console.log(logs);
  console.log('--------------- END OF NODE LOGS ----------------');
  return logs;
};

export const getMainLogs = () => {
  return window.main.getMainLogs({});
};

export const getReferralCode = async (walletAddress: string) => {
  if (walletAddress) {
    const {
      data: { code },
    } = await axios.get<{ code: string }>(
      `${FAUCET_API_URL}/get-referral-code/${walletAddress}`
    );

    return code;
  }
};

export const switchLaunchOnRestart = async () => {
  return window.main.switchLaunchOnRestart();
};

export const limitLogsSize = async () => {
  return window.main.limitLogsSize();
};

export const enableStayAwake = async () => {
  return window.main.enableStayAwake();
};

export const disableStayAwake = async () => {
  return window.main.disableStayAwake();
};

export const getTaskMetadata = async (metadataCID: string) => {
  return window.main
    .getTaskMetadata({
      metadataCID,
    })
    .then((metadata) => {
      return metadata;
    });
};

export const switchNetwork = async () => {
  return window.main.switchNetwork();
};

export const getNetworkUrl = async () => {
  return window.main.getNetworkUrl();
};

export const openLogfileFolder = async (taskPublicKey: string) => {
  if (!taskPublicKey) return false;
  return window.main.openLogfileFolder({
    taskAccountPublicKey: taskPublicKey,
  });
};

export const getActiveAccountName = async () => {
  return window.main.getActiveAccountName();
};

export const getVersion = async () => {
  return window.main.getVersion();
};

export const getMainAccountPublicKey = async (): Promise<string> => {
  const pubkey = await window.main.getMainAccountPubKey();
  return pubkey;
};

export const openBrowserWindow = async (URL: string) => {
  await window.main.openBrowserWindow({ URL });
};
