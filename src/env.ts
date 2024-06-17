export interface Env {
  baseUrl: string;
  loginUrl: string;
  authorizationHeader: string;
}

let _env: Env = {
  baseUrl: 'https://uks.core.gssv-play-prodxhome.xboxlive.com',
  loginUrl: 'https://xhome.gssv-play-prod.xboxlive.com',
  authorizationHeader: 'Authorization',
};

export function getEnv(): Env {
  return _env;
}

export function setEnv(env: Env): void {
  _env = env;
}
