import { JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  constructor(private config: ConfigService) {}

  createJwtOptions() {
    return this.config.get('jwt');
  }
}
