import { GetTaskSourceParam } from 'models';

import { getTaskVariablesNames } from './getTaskVariablesNames';

const taskVariablesNames = ['HOME', 'APPDATA', 'K2_NODE_URL', 'NODE_MODE'];
const sourceCodeWithoutVariableTasks = `import path from 'path';

export function getAppDataPath() {
  switch (process.platform) {
    case 'darwin': {
      return path.join(
        'Home',
        'Library',
        'Application Support',
        'KOII-Desktop-Node'
      );
    }
    case 'win32': {
      return path.join('app-data', 'KOII-Desktop-Node');
    }
    case 'linux': {
      return path.join('Home', '.KOII-Desktop-Node');
    }
    default: {
      console.log('Unsupported platform!');
      process.exit(1);
    }
  }
}`;

// This sample source code contains all the risky delimiters mentioned in https://gitlab.com/koii-network/desktop-node/-/issues/108#note_1193556643 🙌🏻
const sourceCodeWithVariableTasks = `import path from 'path';

export function getAppDataPath() {
  switch (process.platform) {
    case 'darwin': {
      return path.join(
        process.env.${taskVariablesNames[0]},
        'Library',
        'Application Support',
        'KOII-Desktop-Node'
      );
    }
    case 'win32': {
      return path.join(process.env.${taskVariablesNames[1]}, 'KOII-Desktop-Node');
    }
    case 'linux': {
      return path.join(process.env.${taskVariablesNames[0]}, '.KOII-Desktop-Node');
    }
    default: {
      console.log('Unsupported platform!');
      process.exit(1);
    }
  }
}

/**
 * @description Get URL from K2_NODE_URL environment variable
 */
async function getRpcUrlWrapper() {
  if (process.env.${taskVariablesNames[2]}) {
    return process.env.${taskVariablesNames[2]};
  } else {
    console.warn(
      Failed to fetch URL from K2_NODE_URL environment variable setting it to https://k2-testnet.koii.live', {task variable: process.env.${taskVariablesNames[2]}}
    );
    return 'https://k2-testnet.koii.live';
  }
}

const namespaceInstance = new Namespace(
  '',
  null,
  process.env.${taskVariablesNames[3]} || 'service',
  null,
  {}
);`;

const tasks = [
  {
    taskPublicKey: '342dkttYwjx2dUPm3Hk2pxxPVhdWaYHVpg4bxEbvzxGr',
    sourceCode: sourceCodeWithoutVariableTasks,
  },
  {
    taskPublicKey: '4ZbqVcP95zkhm9HsRWSveCosHjUozPf4QC73ce6Q8TRr',
    sourceCode: sourceCodeWithVariableTasks,
  },
];

jest.mock('../getTaskSource', () => ({
  getTaskSource: jest.fn(
    (event: Event, { taskAccountPubKey }: GetTaskSourceParam) => {
      const { sourceCode } = tasks.find(
        (task) => task.taskPublicKey === taskAccountPubKey
      )!;
      return Promise.resolve(sourceCode);
    }
  ),
}));

describe('getTaskVariablesNames', () => {
  it('returns an empty array if the task source code contains no task variables', async () => {
    const { taskPublicKey } = tasks[0];

    const result = await getTaskVariablesNames({} as Event, {
      taskPublicKey,
    });

    expect(result).toEqual([]);
  });

  it('returns unique (non-repeated) task variables names if they are used in the source code of the task', async () => {
    const { taskPublicKey } = tasks[1];

    const result = await getTaskVariablesNames({} as Event, {
      taskPublicKey,
    });

    expect(result).toEqual(taskVariablesNames);
  });
});
