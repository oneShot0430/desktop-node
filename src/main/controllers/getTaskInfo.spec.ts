import koiiTasks from 'main/services/koiiTasks';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

import { getTaskInfo } from './getTaskInfo';

jest.mock('main/services/koiiTasks', () => ({
  getTaskState: jest.fn(),
}));
jest.mock('../node/helpers/parseRawK2TaskData', () => ({
  parseRawK2TaskData: jest.fn(),
}));

describe('getTaskInfo', () => {
  const mockEvent = {} as any; // Mock Event object as needed
  const mockPayload = { taskAccountPubKey: 'testPubKey' };
  const mockContext = 'testContext';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully get task info', async () => {
    const mockPartialRawTaskData = { task_name: 'Test Task' };
    (koiiTasks.getTaskState as jest.Mock).mockResolvedValue(
      mockPartialRawTaskData
    );
    const mockParsedData = { taskName: 'Test Task', taskId: 'testPubKey' };
    (parseRawK2TaskData as jest.Mock).mockReturnValue(mockParsedData);

    const result = await getTaskInfo(mockEvent, mockPayload, mockContext);

    expect(koiiTasks.getTaskState).toHaveBeenCalledWith('testPubKey');
    expect(parseRawK2TaskData).toHaveBeenCalledWith({
      rawTaskData: {
        ...mockPartialRawTaskData,
        task_id: 'testPubKey',
      },
    });
    expect(result).toEqual(mockParsedData);
  });

  it('should handle errors and throw a detailed error', async () => {
    const mockError = new Error('Test Error');
    (koiiTasks.getTaskState as jest.Mock).mockRejectedValue(mockError);

    await expect(
      getTaskInfo(mockEvent, mockPayload, mockContext)
    ).rejects.toThrow(
      'Error during Task parsing in context of testContext: Error: Test Error'
    );
  });
});
