import { Console } from '../../../src/api/models/console';
import { List } from '../../../src/api/models/list';
import { getConsoles } from '../../../src/api/rest/console';

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
        isDevKit: false,
      },
    ],
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockReset();
  });

  it('should retrive the console list', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockReturnValue(consoleList),
    });

    const consoleListResult = await getConsoles(token);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://uks.core.gssv-play-prodxhome.xboxlive.com/v6/servers/home',
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );
    expect(consoleListResult).toBe(consoleList);
  });
});
