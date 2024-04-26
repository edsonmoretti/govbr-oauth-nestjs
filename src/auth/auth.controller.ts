import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FullResponseSample } from '../govbr';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  async signIn(@Res() res: Response) {
    const oauthLoginUrl = await this.authService.signInUrl();
    // console.log('Redirecting to: ', oauthLoginUrl);
    res.redirect(oauthLoginUrl);
  }

  @Get('openid')
  async token(
    @Query('code') code: string,
    @Query('error') error: string,
  ): Promise<FullResponseSample> {
    if (error) {
      console.error('Error: ', error);
      throw new Error(error);
    }
    return this.authService.token(code);
  }
}
