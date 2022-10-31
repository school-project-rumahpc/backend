import { AuthHelper } from './helper/auth.helper';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './../user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfig } from 'src/config/jwt.config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfig,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthHelper],
})
export class AuthModule {}
