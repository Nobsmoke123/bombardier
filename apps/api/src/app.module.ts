import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { CompaniesModule } from './companies/companies.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ImportsModule } from './imports/imports.module.js';
import { LinkedInModule } from './linkedin/linkedin.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ResumesModule } from './resumes/resumes.module.js';
import { SettingsModule } from './settings/settings.module.js';
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
    ImportsModule,
    CompaniesModule,
    LinkedInModule,
    DashboardModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
