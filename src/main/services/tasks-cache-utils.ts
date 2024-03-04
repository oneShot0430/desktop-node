import * as fs from 'fs';
import * as path from 'path';

import { RawTaskData } from 'models';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

const appDataPath = getAppDataPath();
const TASKS_CACHE_FILE = 'tasks.json';
const filePath = path.join(appDataPath, TASKS_CACHE_FILE);

type CachedTasksType = Omit<RawTaskData, 'is_running'>[];

export const saveTasksToCache = async (startedTasksData: CachedTasksType) => {
  try {
    const tasksData = JSON.stringify(startedTasksData);
    console.log('Caching tasks data...');
    await fs.promises.writeFile(filePath, tasksData);
  } catch (error) {
    console.error('Error saving tasks to cache', error);
  }
};

export const getTasksFromCache = async (): Promise<CachedTasksType> => {
  try {
    const tasksData = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(tasksData) as CachedTasksType;
    return data;
  } catch (error) {
    console.error('Error getting tasks from cache', error);
    throw new Error('Error getting tasks from cache');
  }
};
