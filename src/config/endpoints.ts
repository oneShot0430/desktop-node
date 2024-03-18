/* eslint-disable @cspell/spellchecker */
export enum Endpoints {
  GET_TASK_SOURCE = 'GET_TASK_SOURCE',
  GET_TASK_METADATA = 'GET_TASK_METADATA',
  DELEGATE_STAKE = 'DELEGATE_STAKE',
  GET_TASK_INFO = 'GET_TASK_INFO',
  START_TASK = 'START_TASK',
  STOP_TASK = 'STOP_TASK',
  CHECK_WALLET_EXISTS = 'CHECK_WALLET_EXISTS',
  GET_MAIN_ACCOUNT_PUBKEY = 'GET_MAIN_ACCOUNT_PUBKEY',
  GET_STAKING_ACCOUNT_PUBKEY = 'GET_STAKING_ACCOUNT_PUBKEY',
  GET_TASK_LOGS = 'GET_TASK_LOGS',
  GET_MY_TASKS = 'GET_MY_TASKS',
  GET_AVAILABLE_TASKS = 'GET_AVAILABLE_TASKS',
  CLAIM_REWARD = 'CLAIM_REWARD',
  WITHDRAW_STAKE = 'WITHDRAW_STAKE',
  CREATE_NODE_WALLETS = 'CREATE_NODE_WALLETS',
  CREATE_NODE_WALLETS_FROM_JSON = 'CREATE_NODE_WALLETS_FROM_JSON',
  GENERATE_SEED_PHRASE = 'GENERATE_SEED_PHRASE',
  SET_ACTIVE_ACCOUNT = 'SET_ACTIVE_ACCOUNT',
  GET_ALL_ACCOUNTS = 'GET_ALL_ACCOUNTS',
  STORE_USER_CONFIG = 'STORE_USER_CONFIG',
  GET_USER_CONFIG = 'GET_USER_CONFIG',
  GET_TASKS_BY_ID = 'GET_TASKS_BY_ID',
  REMOVE_ACCOUNT_BY_NAME = 'REMOVE_ACCOUNT_BY_NAME',
  OPEN_BROWSER_WINDOW = 'OPEN_BROWSER_WINDOW',
  GET_TASK_NODE_INFO = 'GET_TASK_NODE_INFO',
  GET_STORED_TASK_VARIABLES = 'GET_STORED_TASK_VARIABLES',
  GET_STORED_PAIRED_TASK_VARIABLES = 'GET_STORED_PAIRED_TASK_VARIABLES',
  STORE_TASK_VARIABLE = 'STORE_TASK_VARIABLE',
  GET_TASK_VARIABLES_NAMES = 'GET_TASK_VARIABLES_NAMES',
  EDIT_TASK_VARIABLE = 'EDIT_TASK_VARIABLE',
  DELETE_TASK_VARIABLE = 'DELETE_TASK_VARIABLE',
  PAIR_TASK_VARIABLE = 'PAIR_TASK_VARIABLE',
  UNPAIR_TASK_VARIABLE = 'UNPAIR_TASK_VARIABLE',
  GET_TASKS_PAIRED_WITH_VARIABLE = 'GET_TASKS_PAIRED_WITH_VARIABLE',
  GET_TASK_PAIRED_VARIABLES_NAMES_WITH_LABELS = 'GET_TASK_PAIRED_VARIABLES_NAMES_WITH_LABELS',
  GET_ACCOUNT_BALANCE = 'GET_ACCOUNT_BALANCE',
  GET_AVERAGE_SLOT_TIME = 'GET_AVERAGE_SLOT_TIME',
  SWITCH_NETWORK = 'SWITCH_NETWORK',
  GET_NETWORK_URL = 'GET_NETWORK_URL',
  GET_CURRENT_SLOT = 'GET_CURRENT_SLOT',
  INITIALIZE_TASKS = 'INITIALIZE_TASKS',
  OPEN_LOGFILE_FOLDER = 'OPEN_LOGFILE_FOLDER',
  OPEN_NODE_LOGFILE_FOLDER = 'OPEN_NODE_LOGFILE_FOLDER',
  GET_ACTIVE_ACCOUNT_NAME = 'GET_ACTIVE_ACCOUNT_NAME',
  GET_VERSION = 'GET_VERSION',
  GET_ENCRYPTED_SECRET_PHRASE = 'GET_ENCRYPTED_SECRET_PHRASE',
  ARCHIVE_TASK = 'ARCHIVE_TASK',
  DOWNLOAD_APP_UPDATE = 'DOWNLOAD_APP_UPDATE',
  CHECK_APP_UPDATE = 'CHECK_APP_UPDATE',
  STORE_ALL_TIME_REWARDS = 'STORE_ALL_TIME_REWARDS',
  GET_ALL_TIME_REWARDS_BY_TASK = 'GET_ALL_TIME_REWARDS_BY_TASK',
  VALIDATE_PUBLIC_KEY = 'VALIDATE_PUBLIC_KEY',
  GET_RUNNED_PRIVATE_TASKS = 'GET_RUNNED_PRIVATE_TASKS',
  SET_RUNNED_PRIVATE_TASKS = 'SET_RUNNED_PRIVATE_TASKS',
  GET_IS_TASK_RUNNING = 'GET_IS_TASK_RUNNING',
  ENABLE_STAY_AWAKE = 'ENABLE_STAY_AWAKE',
  DISABLE_STAY_AWAKE = 'DISABLE_STAY_AWAKE',
  GET_MAIN_LOGS = 'GET_MAIN_LOGS',
  GET_STARTED_TASKS_PUBKEYS = 'GET_STARTED_TASKS_PUBKEYS',
  UPGRADE_TASK = 'UPGRADE_TASK',
  GET_RUNNING_TASKS_PUBKEYS = 'GET_RUNNING_TASKS_PUBKEYS',
  GET_TIME_TO_NEXT_REWARD = 'GET_TIME_TO_NEXT_REWARD',
  CANCEL_TASK_RETRY = 'CANCEL_TASK_RETRY',
  GET_RETRY_DATA_BY_TASK_ID = 'GET_RETRY_DATA_BY_TASK_ID',
  SWITCH_LAUNCH_ON_RESTART = 'SWITCH_LAUNCH_ON_RESTART',
  STOP_ALL_TASKS = 'STOP_ALL_TASKS',
  START_ALL_TASKS = 'START_ALL_TASKS',
  ADD_TASKS_SCHEDULE = 'ADD_TASKS_SCHEDULE',
  REMOVE_TASKS_SCHEDULE = 'REMOVE_TASKS_SCHEDULE',
  UPDATE_TASKS_SCHEDULE_BY_ID = 'UPDATE_TASKS_SCHEDULE_BY_ID',
  GET_TASKS_SCHEDULES = 'GET_TASKS_SCHEDULES',
  GET_TASKS_SCHEDULE_BY_ID = 'GET_TASKS_SCHEDULE_BY_ID',
  ADD_TASK_TO_SCHEDULER = 'ADD_TASK_TO_SCHEDULER',
  GET_SCHEDULER_TASKS = 'GET_SCHEDULER_TASKS',
  REMOVE_TASK_FROM_SCHEDULER = 'REMOVE_TASK_FROM_SCHEDULER',
  VALIDATE_SCHEDULER_SESSION = 'VALIDATE_SCHEDULER_SESSION',
  CREDIT_STAKING_WALLET_FROM_MAIN_WALLET = 'CREDIT_STAKING_WALLET_FROM_MAIN_WALLET',
  CHECK_ORCA_PODMAN_EXISTS_AND_RUNNING = 'CHECK_ORCA_PODMAN_EXISTS_AND_RUNNING',
  LIMIT_LOGS_SIZE = 'LIMIT_LOGS_SIZE',
  START_EMERGENCY_MIGRATION = 'START_EMERGENCY_MIGRATION',
  FINISH_EMERGENCY_MIGRATION = 'FINISH_EMERGENCY_MIGRATION',
  GET_TASK_LAST_SUBMISSION_TIME = 'GET_TASK_LAST_SUBMISSION_TIME',
  GET_LATEST_AVERAGE_TASK_REWARD = 'GET_LATEST_AVERAGE_TASK_REWARD',
  REDEEM_TOKENS_IN_NEW_NETWORK = 'REDEEM_TOKENS_IN_NEW_NETWORK',
  TRANSFER_KOII_FROM_MAIN_WALLET = 'TRANSFER_KOII_FROM_MAIN_WALLET',
  TRANSFER_KOII_FROM_STAKING_WALLET = 'TRANSFER_KOII_FROM_STAKING_WALLET',
  START_ORCA_VM = 'START_ORCA_VM',
  GET_NOTIFICATIONS = 'GET_NOTIFICATIONS',
  STORE_NOTIFICATION = 'STORE_NOTIFICATION',
  PURGE_NOTIFICATIONS = 'PURGE_NOTIFICATIONS',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION',
  FETCH_S3_FOLDER_CONTENTS = 'FETCH_S3_FOLDER_CONTENTS',
  GET_ENCRYPTED_SECRET_PHRASE_MAP = 'GET_ENCRYPTED_SECRET_PHRASE_MAP',
  SAVE_ENCRYPTED_SECRET_PHRASE_MAP = 'SAVE_ENCRYPTED_SECRET_PHRASE_MAP',
  APP_RELAUNCH = 'APP_RELAUNCH',
  FETCH_AND_SAVE_UPNP_BIN = 'FETCH_AND_SAVE_UPNP_BIN',
  CHECK_UPNP_BINARY = 'CHECK_UPNP_BINARY',
}

export enum RendererEndpoints {
  UPDATE_AVAILABLE = 'UPDATE_AVAILABLE',
  SYSTEM_WAKE_UP = 'SYSTEM_WAKE_UP',
  UPDATE_DOWNLOADED = 'UPDATE_DOWNLOADED',
}
