import { DatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { UserModule } from './module/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { Config } from './config/main.config';
import { AuthModule } from './module/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RoleModule } from './module/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [Config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    CategoryModule,
    ProductModule,
    AuthModule,
    UserModule,
    RoleModule,
  ],
  providers: [
    // Add Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
