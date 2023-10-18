import { getUserConfig } from './controllers';
import { loadAndExecuteTasks } from './node';

export default async (): Promise<void> => {
  const userConfig = await getUserConfig();
  if (userConfig?.hasFinishedEmergencyMigration) {
    await loadAndExecuteTasks();
  }
};
