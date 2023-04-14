import initHandlers from './initHandlers';
import { loadAndExecuteTasks } from './node';

export default async (): Promise<void> => {
  initHandlers();
  await loadAndExecuteTasks();
};
