import { getEnv } from '../../env';
import { Console } from '../models/console';
import { List } from '../models/list';
import { handleError } from '../rest/handle-error';

/**
 * Retrive the list of consoles associated with the account.
 *
 * @param token Game Streaming Token (GSToken)
 * @returns A List of consoles
 */
export async function getConsoles(token: string): Promise<List<Console>> {
  return await fetch(`${getEnv().baseUrl}/v6/servers/home`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [getEnv().authorizationHeader]: 'Bearer ' + token
      }
    })
    .then(handleError)
    .then((response) => response.json());
}
