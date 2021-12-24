import { getGSToken } from '../../../src/api/rest/auth';
import { createMockFetch } from '../../test-utils/fetch';

describe('getGSToken', () => {
  const gsToken = 'GSTOKEN_TEST';
  const oauthToken = 'OAUTH_TOKEN_TEST';

  test('should retrive the GSToken', async () => {
    const mockFetch = jest.fn().mockImplementation(createMockFetch({ gsToken }));
    global.fetch = mockFetch;

    const gsTokenResult = await getGSToken(oauthToken);

    expect(global.fetch).toHaveBeenCalledWith('https://xhome.gssv-play-prod.xboxlive.com/v2/login/user', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: oauthToken,
        offeringId: 'xhome'
      })
    });
    expect(gsTokenResult).toBe(gsToken);

    mockFetch.mockClear();
    delete global.fetch;
  });

});
