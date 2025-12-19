import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { LeavesModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationStructureModule } from './organization-structure/organization-structure.module';
import { EmployeeProfile, EmployeeProfileSchema } from './employee-profile/Models/employee-profile.schema';
import { PayrollExecutionModule } from './payroll-execution/payroll-execution.module';
import { PayrollConfigurationModule } from './payroll-configuration/payroll-configuration.module';
import { PayrollTrackingModule } from './payroll-tracking/payroll-tracking.module';
import { PerformanceModule } from './performance/performance.module';
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
    OrganizationStructureModule,
    RecruitmentModule,
    LeavesModule,
    PayrollExecutionModule,
    PayrollConfigurationModule,
    PayrollTrackingModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }