import initHandlers from './initHandlers';
import node from './node';

export default async () => {
  initHandlers();
  await node();
};
