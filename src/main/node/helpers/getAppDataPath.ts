import { app } from 'electron';
import path from 'path';

// eslint-disable-next-line consistent-return
export function getAppDataPath() {
  switch (process.platform) {
    case 'darwin': {
      return path.join(
        app.getPath('home'),
        'Library',
        'Application Support',
        'KOII-Desktop-Node'
      );
    }
    case 'win32': {
      return path.join(app.getPath('appData'), 'KOII-Desktop-Node');
    }
    case 'linux': {
      return path.join(app.getPath('home'), '.KOII-Desktop-Node');
    }
    default: {
      console.log('Unsupported platform!');
      process.exit(1);
    }
  }
}
