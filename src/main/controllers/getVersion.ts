import { app } from 'electron';

export const getVersion = async (): Promise<string> => {
  // NOTE: For dev run it will return version of Electron
  // For production it will be proper version from release/app/package.json
  return app.getVersion();
};
