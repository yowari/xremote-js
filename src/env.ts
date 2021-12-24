export interface Env {
  baseUrl: string;
  loginUrl: string;
}

let _env: Env = {
  baseUrl: 'https://uks.gssv-play-prodxhome.xboxlive.com',
  loginUrl: 'https://xhome.gssv-play-prod.xboxlive.com'
}

export function getEnv(): Env {
  return _env;
}

export function setEnv(env: Env): void {
  _env = env;
}
