import { AuthUser } from './auth/entities/auth-user.entity';
import { AccessTokenData } from './auth/entities/access-token-data.entity';

export type Govbr = {
  urlProvider: string;
  urlService: string;
  redirectUri: string;
  scopes: string;
  clientId: string;
  clientSecret: string;
};

type base64 = string;

export type FullResponseSample = {
  authUser: AuthUser;
  userInfo: AuthUser;
  userImageBase64: base64;
  govBrAuthResponse: GovBrAuthResponse;
  accessTokenData: AccessTokenData;
  govBrJwkResponse: GovBrJwkResponse;
};

export type GovBrAuthResponse = {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: string;
};

export type GovBrJwkResponse = {
  keys: Jwk[];
};

type Jwk = {
  kty: string;
  e: string;
  kid: string;
  alg: string;
  n: string;
};

export function getGovBrConfig(): Govbr {
  const govbrConfig = {
    urlProvider: process.env.GOVBR_URL_PROVIDER,
    urlService: process.env.GOVBR_URL_SERVICE,
    redirectUri: process.env.GOVBR_REDIRECT_URI,
    scopes: process.env.GOVBR_SCOPES,
    clientId: process.env.GOVBR_CLIENT_ID,
    clientSecret: process.env.GOVBR_SECRET,
  };
  if (invalidConfig(govbrConfig)) {
    const error = `Erro: authorize - Os parâmetros REDIRECT_URI, CLIENT_ID e SECRET, são obrigatórios`;
    console.error(error);
    throw new Error(error);
  }
  return govbrConfig;
}

function invalidConfig(config: Govbr): boolean {
  if (
    config &&
    config.redirectUri &&
    config.clientId &&
    config.clientSecret &&
    config.urlProvider &&
    config.urlService &&
    config.scopes
  ) {
    return false;
  }
  return true;
}

export function jwtDecode(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
}
