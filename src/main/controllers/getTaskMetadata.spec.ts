import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';
import { getTaskMetadata } from './getTaskMetadata';

jest.mock('./fetchFromIPFSOrArweave', () => ({
  __esModule: true,
  fetchFromIPFSOrArweave: jest.fn(),
}));

describe('getTaskMetadata', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error if metadataCID is missing', async () => {
    const payload: any = {};

    await expect(getTaskMetadata({} as Event, payload)).rejects.toThrow();
  });

  it('throws too many request error', async () => {
    const payload = {
      metadataCID: 'example_cid',
    };

    (fetchFromIPFSOrArweave as jest.Mock).mockReturnValue(
      '429 Too Many Requests'
    );

    await expect(getTaskMetadata({} as Event, payload)).rejects.toThrow();
  });

  it('returns metadata', async () => {
    const payload = {
      metadataCID: 'example_cid',
    };

    (fetchFromIPFSOrArweave as jest.Mock).mockReturnValue(
      JSON.stringify({ response: 'example_response' })
    );

    const result = await getTaskMetadata({} as Event, payload);
    expect(result).toEqual({
      response: 'example_response',
    });
  });
});
