import initHandlers from './initHandlers';
import node from './node';

export default async (): Promise<void> => {
  initHandlers();
  await node();
};
