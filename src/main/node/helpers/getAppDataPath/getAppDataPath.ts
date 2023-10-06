import { app } from 'electron';
import path from 'path';

const platformsSupported = ['darwin', 'win32', 'linux'];

// eslint-disable-next-line consistent-return
export function getAppDataPath() {
  if (
    process.env.DB_MODE === 'development' &&
    process.env.NODE_ENV === 'development'
  )
    return './appdata';
  if (platformsSupported.includes(process.platform))
    return path.join(app.getPath('appData'), 'KOII-Desktop-Node');
  else {
    console.log('Unsupported platform!');
    process.exit(1);
  }
}