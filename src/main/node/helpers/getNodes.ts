import sdk from 'services/sdk';

export default async (): Promise<any> => {
  let nodes = [];
  try {
    nodes = JSON.parse(await sdk.koiiTools.redisGetAsync('nodeRegistry')) || [];
  } catch (err) {
    console.error('Get nodes error: ', err.message);
  }

  return nodes;
};
