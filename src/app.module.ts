import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { Config } from './config/main.config';
import { AuthModule } from './module/auth/auth.module';
import { CartModule } from './module/cart/cart.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { UserModule } from './module/user/user.module';

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
    CartModule,
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
