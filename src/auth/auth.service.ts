import { Injectable } from '@nestjs/common';
import {
  FullResponseSample,
  getGovBrConfig,
  GovBrAuthResponse,
  GovBrJwkResponse,
  jwtDecode,
} from '../govbr';
import { AccessTokenData } from './entities/access-token-data.entity';
import { AuthUser } from './entities/auth-user.entity';

@Injectable()
export class AuthService {
  private AUTHORIZATION_CODE = 'authorization_code';
  private CODE = 'code';
  async signInUrl(): Promise<string> {
    const govbrConfig = getGovBrConfig();
    return `${govbrConfig.urlProvider}/authorize?response_type=${this.CODE}&client_id=${govbrConfig.clientId}&scope=${govbrConfig.scopes}&redirect_uri=${govbrConfig.redirectUri}`;
  }

  async token(code: string): Promise<FullResponseSample> {
    const govbrConfig = getGovBrConfig();
    const response = await fetch(`${govbrConfig.urlProvider}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: this.AUTHORIZATION_CODE,
        code: code,
        client_id: govbrConfig.clientId,
        client_secret: govbrConfig.clientSecret,
        redirect_uri: govbrConfig.redirectUri,
      }),
    });
    const govBrAuthResponse = (await response.json()) as GovBrAuthResponse;
    const auth = jwtDecode(govBrAuthResponse.id_token) as AuthUser;
    const accessTokenData = jwtDecode(
      govBrAuthResponse.access_token,
    ) as AccessTokenData;
    const jwkTest = await this.jwk(govBrAuthResponse.access_token);
    const userInfo = await this.userInfo(govBrAuthResponse.access_token);
    const userImage = await this.userImage(govBrAuthResponse.access_token);

    return {
      authUser: auth,
      userInfo: userInfo,
      userImageBase64: userImage,
      govBrAuthResponse: govBrAuthResponse,
      accessTokenData: accessTokenData,
      govBrJwkResponse: jwkTest,
    };
  }

  async jwk(accessToken: string): Promise<GovBrJwkResponse> {
    const govbrConfig = getGovBrConfig();
    const response = await fetch(`${govbrConfig.urlProvider}/jwk`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();
  }

  async userInfo(accessToken: string): Promise<AuthUser> {
    const govbrConfig = getGovBrConfig();
    const response = await fetch(`${govbrConfig.urlProvider}/userinfo`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();
  }

  async userImage(accessToken: string): Promise<string> {
    const govbrConfig = getGovBrConfig();
    const response = await fetch(
      `${govbrConfig.urlProvider}/userinfo/picture`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // Get the response as an ArrayBuffer
    const imageBuffer = await response.arrayBuffer();

    // Convert the ArrayBuffer to a base64 string
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    return base64Image;
  }
}
