import { ipcMain } from 'electron';

import { Endpoints } from '../config/endpoints';
import mainErrorHandler from '../utils/mainErrorHandler';

import * as controllers from './controllers';
import errorHandler from './errorHandler';

const endpointToControllerMap: Record<
  Endpoints,
  (event: Event, ...args: any[]) => unknown
> = {
  [Endpoints.GET_MY_TASKS]: controllers.getMyTasks,
  [Endpoints.GET_AVAILABLE_TASKS]: controllers.getAvailableTasks,
  [Endpoints.GET_TASK_SOURCE]: controllers.getTaskSource,
  [Endpoints.GET_TASK_METADATA]: controllers.getTaskMetadata,
  [Endpoints.DELEGATE_STAKE]: controllers.delegateStake,
  [Endpoints.GET_TASK_INFO]: controllers.getTaskInfo,
  [Endpoints.START_TASK]: controllers.startTask,
  [Endpoints.STOP_TASK]: controllers.stopTask,
  [Endpoints.CHECK_WALLET_EXISTS]: controllers.checkWalletExists,
  [Endpoints.GET_MAIN_ACCOUNT_PUBKEY]: controllers.getMainAccountPubKey,
  [Endpoints.GET_TASK_LOGS]: controllers.getTaskLogs,
  [Endpoints.GET_STAKING_ACCOUNT_PUBKEY]: controllers.getStakingAccountPubKey,
  [Endpoints.CLAIM_REWARD]: controllers.claimReward,
  [Endpoints.CREATE_NODE_WALLETS]: controllers.createNodeWallets,
  [Endpoints.CREATE_NODE_WALLETS_FROM_JSON]:
    controllers.createNodeWalletsFromJson,
  [Endpoints.GENERATE_SEED_PHRASE]: controllers.generateSeedPhrase,
  [Endpoints.SET_ACTIVE_ACCOUNT]: controllers.setActiveAccount,
  [Endpoints.GET_ALL_ACCOUNTS]: controllers.getAllAccounts,
  [Endpoints.GET_ACTIVE_ACCOUNT_NAME]: controllers.getActiveAccountName,
  [Endpoints.STORE_USER_CONFIG]: controllers.storeUserConfig,
  [Endpoints.GET_USER_CONFIG]: controllers.getUserConfig,
  [Endpoints.GET_TASKS_BY_ID]: controllers.getTasksById,
  [Endpoints.REMOVE_ACCOUNT_BY_NAME]: controllers.removeAccountByName,
  [Endpoints.OPEN_BROWSER_WINDOW]: controllers.openBrowserWindow,
  [Endpoints.GET_TASK_NODE_INFO]: controllers.getTaskNodeInfo,
  [Endpoints.WITHDRAW_STAKE]: controllers.withdrawStake,
  [Endpoints.GET_TASK_VARIABLES_NAMES]: controllers.getTaskVariablesNames,
  [Endpoints.GET_STORED_TASK_VARIABLES]: controllers.getStoredTaskVariables,
  [Endpoints.STORE_TASK_VARIABLE]: controllers.storeTaskVariable,
  [Endpoints.DELETE_TASK_VARIABLE]: controllers.deleteTaskVariable,
  [Endpoints.EDIT_TASK_VARIABLE]: controllers.editTaskVariable,
  [Endpoints.PAIR_TASK_VARIABLE]: controllers.pairTaskVariable,
  [Endpoints.UNPAIR_TASK_VARIABLE]: controllers.unpairTaskVariable,
  [Endpoints.GET_TASKS_PAIRED_WITH_VARIABLE]:
    controllers.getTasksPairedWithVariable,
  [Endpoints.GET_STORED_PAIRED_TASK_VARIABLES]:
    controllers.getStoredPairedTaskVariables,
  [Endpoints.GET_ACCOUNT_BALANCE]: controllers.getAccountBalance,
  [Endpoints.GET_AVERAGE_SLOT_TIME]: controllers.getAverageSlotTime,
  [Endpoints.GET_ENCRYPTED_SECRET_PHRASE]: controllers.getEncryptedSecretPhrase,
  [Endpoints.SWITCH_NETWORK]: controllers.switchNetwork,
  [Endpoints.GET_NETWORK_URL]: controllers.getNetworkUrl,
  [Endpoints.GET_CURRENT_SLOT]: controllers.getCurrentSlot,
  [Endpoints.INITIALIZE_TASKS]: controllers.initializeTasks,
  [Endpoints.GET_TASK_PAIRED_VARIABLES_NAMES_WITH_LABELS]:
    controllers.getTaskPairedVariablesNamesWithLabels,
  [Endpoints.OPEN_LOGFILE_FOLDER]: controllers.openLogfileFolder,
  [Endpoints.OPEN_NODE_LOGFILE_FOLDER]: controllers.openNodeLogfileFolder,
  [Endpoints.GET_VERSION]: controllers.getVersion,
  [Endpoints.ARCHIVE_TASK]: controllers.archiveTask,
  [Endpoints.DOWNLOAD_APP_UPDATE]: controllers.downloadAppUpdate,
  [Endpoints.STORE_ALL_TIME_REWARDS]: controllers.storeAllTimeRewards,
  [Endpoints.GET_ALL_TIME_REWARDS_BY_TASK]: controllers.getAllTimeRewardsByTask,
  [Endpoints.VALIDATE_PUBLIC_KEY]: controllers.isValidWalletAddress,
  [Endpoints.GET_RUNNED_PRIVATE_TASKS]: controllers.getRunnedPrivateTasks,
  [Endpoints.SET_RUNNED_PRIVATE_TASKS]: controllers.setRunnedPrivateTask,
  [Endpoints.GET_IS_TASK_RUNNING]: controllers.getIsTaskRunning,
  [Endpoints.ENABLE_STAY_AWAKE]: controllers.enableStayAwake,
  [Endpoints.DISABLE_STAY_AWAKE]: controllers.disableStayAwake,
  [Endpoints.UPGRADE_TASK]: controllers.upgradeTask,
  [Endpoints.GET_MAIN_LOGS]: controllers.getMainLogs,
  [Endpoints.GET_STARTED_TASKS_PUBKEYS]: controllers.getStartedTasksPubKeys,
  [Endpoints.GET_RUNNING_TASKS_PUBKEYS]: controllers.getRunningTasksPubKeys,
  [Endpoints.GET_TIME_TO_NEXT_REWARD]: controllers.getTimeToNextReward,
  [Endpoints.CANCEL_TASK_RETRY]: controllers.cancelTaskRetry,
  [Endpoints.GET_RETRY_DATA_BY_TASK_ID]: controllers.getRetryDataByTaskId,
  [Endpoints.SWITCH_LAUNCH_ON_RESTART]: controllers.switchLaunchOnRestart,
  [Endpoints.STOP_ALL_TASKS]: controllers.stopAllTasks,
  [Endpoints.START_ALL_TASKS]: controllers.startAllTasks,
  [Endpoints.ADD_TASKS_SCHEDULE]: controllers.addSession,
  [Endpoints.REMOVE_TASKS_SCHEDULE]: controllers.removeSession,
  [Endpoints.UPDATE_TASKS_SCHEDULE_BY_ID]: controllers.updateSessionById,
  [Endpoints.GET_TASKS_SCHEDULES]: controllers.getAllSessions,
  [Endpoints.GET_TASKS_SCHEDULE_BY_ID]: controllers.getSessionById,
  [Endpoints.ADD_TASK_TO_SCHEDULER]: controllers.addTaskToScheduler,
  [Endpoints.GET_SCHEDULER_TASKS]: controllers.getSchedulerTasks,
  [Endpoints.REMOVE_TASK_FROM_SCHEDULER]: controllers.removeTaskFromScheduler,
  [Endpoints.VALIDATE_SCHEDULER_SESSION]: controllers.validateSchedulerSession,
  [Endpoints.START_EMERGENCY_MIGRATION]: controllers.startEmergencyMigration,
  [Endpoints.FINISH_EMERGENCY_MIGRATION]: controllers.finishEmergencyMigration,
  [Endpoints.CREDIT_STAKING_WALLET_FROM_MAIN_WALLET]:
    controllers.creditStakingWalletFromMainWallet,
};

const initHandlers = (): void => {
  Object.entries(endpointToControllerMap).forEach(
    ([endpointKey, controller]) => {
      ipcMain.handle(endpointKey, mainErrorHandler(controller));
    }
  );
};

export default errorHandler(initHandlers, 'Init handlers error');
