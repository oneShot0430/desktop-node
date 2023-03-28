import path from 'path';

// eslint-disable-next-line consistent-return
export function getAppDataPath() {
  switch (process.platform) {
    case 'darwin': {
      return path.join(
        process.env.HOME!,
        'Library',
        'Application Support',
        'KOII-Desktop-Node'
      );
    }
    case 'win32': {
      return path.join(process.env.APPDATA!, 'KOII-Desktop-Node');
    }
    case 'linux': {
      return path.join(process.env.HOME!, '.KOII-Desktop-Node');
    }
    default: {
      console.log('Unsupported platform!');
      process.exit(1);
    }
  }
}

export function getStakingWalletPath(activeAccount: string) {
  return `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;
}
