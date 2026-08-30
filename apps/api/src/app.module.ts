import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { StorageModule } from './storage/storage.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    StorageModule,
    ResumesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
