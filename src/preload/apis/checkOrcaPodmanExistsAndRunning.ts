import config from 'config';
import { checkOrcaPodmanExistsAndRunningResponse } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (): Promise<checkOrcaPodmanExistsAndRunningResponse> =>
  sendMessage(config.endpoints.CHECK_ORCA_PODMAN_EXISTS_AND_RUNNING, {});
