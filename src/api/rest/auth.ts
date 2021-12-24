import { getEnv } from '../../env';
import { handleError } from '../rest/handle-error';

/**
 * Retrieve a Game Streaming Token (GSToken).
 *
 * @param oauthToken OAuth Token
 * @returns Game Streaming Token (GSToken)
 */
export async function getGSToken(oauthToken: string): Promise<string> {
  const body = {
    token: oauthToken,
    offeringId: 'xhome'
  };

  const response = await fetch(`${getEnv().loginUrl}/v2/login/user`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(handleError);

  const result = await response.json();

  return result.gsToken;
}
