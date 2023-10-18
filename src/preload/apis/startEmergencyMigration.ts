import config from 'config';
import sendMessage from 'preload/sendMessage';

export default () =>
  sendMessage(config.endpoints.START_EMERGENCY_MIGRATION, {});
