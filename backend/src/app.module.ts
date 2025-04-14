import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { PropertyModule } from './property/property.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 👈 VERY IMPORTANT
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // make sure this path points to your 'public' folder
      serveRoot: '/public', // URL path prefix
    }),
    AuthModule,
    AdminModule,
    UserModule,
    BlockchainModule,
    PropertyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
