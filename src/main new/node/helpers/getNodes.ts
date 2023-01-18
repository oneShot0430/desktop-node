import { getCacheNodes } from './Namespace';

export default async (): Promise<any> => {
  let nodes = [];
  try {
    nodes = await getCacheNodes();
  } catch (err) {
    console.error('Get nodes error: ', err.message);
  }

  return nodes;
};
