import { handleError } from './handle-error';
import { getEnv } from '../../env';
import { ICEState } from '../models/ice-state';
import { SDPState } from '../models/sdp-state';
import { Session } from '../models/session';
import { SessionConfiguration } from '../models/session-configuration';
import { SessionState } from '../models/session-state';

const i = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function makeBase(): string {
  let e = '';
  for (let t = 0; t < 22; t++) {
    e += i.charAt(Math.floor(Math.random() * i.length));
  }
  return e;
}

/**
 * Create new game streaming session.
 *
 * @param token Game Streaming Token (GSToken)
 * @param serverId Console's server ID
 * @returns Session
 */
export function createSession(
  token: string,
  serverId: string
): Promise<Session> {
  const body = {
    titleId: '',
    systemUpdateGroup: '',
    clientSessionId: '',
    settings: {
      nanoVersion: 'V3;WebrtcTransport.dll',
      enableTextToSpeech: false,
      enableOptionalDataCollection: false,
      highContrast: 0,
      locale: 'en-US',
      useIceConnection: false,
      timezoneOffsetMinutes: 120,
      sdkType: 'web',
      osName: 'windows',
    },
    serverId: serverId,
    fallbackRegionNames: [],
  };

  return fetch(`${getEnv().baseUrl}/v5/sessions/home/play`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  })
    .then(handleError)
    .then((response) => response.json());
}

/**
 * Retrieve session's state.
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @returns Session's State
 */
export function getSessionState(
  token: string,
  sessionId: string
): Promise<SessionState> {
  return fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/state`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
  })
    .then(handleError)
    .then((response) => response.json());
}

/**
 * Retrive session's configuration.
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @returns Session Configuration
 */
export function getSessionConfiguration(
  token: string,
  sessionId: string
): Promise<SessionConfiguration> {
  return fetch(
    `${getEnv().baseUrl}/v5/sessions/home/${sessionId}/configuration`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [getEnv().authorizationHeader]: 'Bearer ' + token,
      },
    }
  )
    .then(handleError)
    .then((response) => response.json());
}

/**
 * Send Session Description Protocol (SDP) profile to negotiate the communication.
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @param sdp Session Description Protocol (SDP) Profile
 */
export async function sendSDP(
  token: string,
  sessionId: string,
  sdp: string
): Promise<void> {
  const body = {
    messageType: 'offer',
    sdp: sdp,
    configuration: {
      containerizeAudio: false,
      // "containerizeVideo": true,
      // "requestedH264Profile": 2,
      chatConfiguration: {
        bytesPerSample: 2,
        expectedClipDurationMs: 20,
        format: {
          codec: 'opus',
          container: 'webm',
        },
        numChannels: 1,
        sampleFrequencyHz: 24000,
      },
      chat: {
        minVersion: 1,
        maxVersion: 1,
      },
      control: {
        minVersion: 1,
        maxVersion: 3,
      },
      input: {
        minVersion: 1,
        maxVersion: 8,
      },
      message: {
        minVersion: 1,
        maxVersion: 1,
      },
    },
  };

  await fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/sdp`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  }).then(handleError);
}

/**
 * Retrieve Session Description Protocol (SDP) State.
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @returns Session Description Protocol (SDP) State
 */
export async function getSDPState(
  token: string,
  sessionId: string
): Promise<SDPState> {
  return fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/sdp`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
  })
    .then(handleError)
    .then((response) => response.text())
    .then((responseText) => {
      if (responseText === '') {
        return null;
      } else {
        return JSON.parse(responseText);
      }
    });
}

/**
 * Send Interactive Connectivity Establishment (ICE) candidate for NAT traversal.
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @param ice Interactive Connectivity Establishment (ICE) candidate
 */
export async function sendICE(
  token: string,
  sessionId: string,
  ice: string
): Promise<void> {
  const body = {
    messageType: 'iceCandidate',
    candidate: ice,
  };

  await fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/ice`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
    body: JSON.stringify(body),
  }).then(handleError);
}

/**
 * Retrive Interactive Connectivity Establishment (ICE) ICE State
 *
 * @param token Game Streaming Token (GSToken)
 * @param sessionId Session ID
 * @returns Interactive Connectivity Establishment (ICE) State
 */
export async function getICEState(
  token: string,
  sessionId: string
): Promise<ICEState> {
  return fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/ice`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
  })
    .then(handleError)
    .then((response) => response.text())
    .then((responseText) => {
      if (responseText === '') {
        return null;
      } else {
        return JSON.parse(responseText);
      }
    });
}

export async function sendKeepAlive(
  token: string,
  sessionId: string
): Promise<void> {
  await fetch(`${getEnv().baseUrl}/v5/sessions/home/${sessionId}/keepalive`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      [getEnv().authorizationHeader]: 'Bearer ' + token,
    },
  }).then(handleError);
}
