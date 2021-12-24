import { Console } from '../../../src/api/models/console';
import { List } from '../../../src/api/models/list';
import { getConsoles } from '../../../src/api/rest/console';
import { createMockFetch } from '../../test-utils/fetch';

describe('getConsoles', () => {
  const token = 'GSTOKEN_TEST';
  const consoleList: List<Console> = {
    totalItems: 1,
    continuationToken: '',
    results: [
      {
        deviceName: '',
        serverId: '',
        powerState: '',
        consoleType: '',
        playPath: '/play/path',
        outOfHomeWarning: false,
        wirelessWarning: false,
        isDevKit: false
      }
    ]
  };

  test('should retrive the console list', async () => {
    const mockFetch = jest.fn().mockImplementation(createMockFetch(consoleList));
    global.fetch = mockFetch;

    const consoleListResult = await getConsoles(token);

    expect(global.fetch).toHaveBeenCalledWith('https://uks.gssv-play-prodxhome.xboxlive.com/v6/servers/home', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    expect(consoleListResult).toBe(consoleList);

    mockFetch.mockClear();
    delete global.fetch;
  });

});
