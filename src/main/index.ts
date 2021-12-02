import initHandlers from './initHandlers';
import node from './node';

export default async (): Promise<any> => {
  initHandlers();
  await node();
};
