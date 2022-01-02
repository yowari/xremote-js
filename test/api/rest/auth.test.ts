import { getGSToken } from '../../../src/api/rest/auth';

describe('getGSToken', () => {
  const gsToken = 'GSTOKEN_TEST';
  const oauthToken = 'OAUTH_TOKEN_TEST';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    (global.fetch as jest.Mock).mockRestore();
  });

  it('should retrive the GSToken', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockReturnValue({ gsToken })
    });

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
  });

});
