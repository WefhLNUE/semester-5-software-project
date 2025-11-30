import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { LeavesModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeProfile, EmployeeProfileSchema } from './employee-profile/Models/employee-profile.schema';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    // Register Employee schema to resolve references
    MongooseModule.forFeature([
      { name: EmployeeProfile.name, schema: EmployeeProfileSchema },
    ]),
    AuthModule,
    RecruitmentModule,
    LeavesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}