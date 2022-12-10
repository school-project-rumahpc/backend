import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DatabaseConfig } from './config/database.config';
import { Config } from './config/main.config';
import { AuthModule } from './module/auth/auth.module';
import { CartModule } from './module/cart/cart.module';
import { CategoryModule } from './module/category/category.module';
import { OrderModule } from './module/order/order.module';
import { ProductModule } from './module/product/product.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [Config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/api/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MulterModule.register(),
    ScheduleModule.forRoot(),
    CategoryModule,
    ProductModule,
    AuthModule,
    UserModule,
    CartModule,
    OrderModule,
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
