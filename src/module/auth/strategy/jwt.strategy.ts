import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from './../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Take jwt from header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Take jwt from cookie
        JwtStrategy.cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userService.findById(payload.sub);
    return user;
  }

  private static cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
  }
}
