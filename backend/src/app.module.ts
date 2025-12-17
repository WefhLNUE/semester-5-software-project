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
import { Department, DepartmentSchema } from './organization-structure/Models/department.schema';
import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    // Register Department globally first so it's available when Position schema pre-save hook runs
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
    ]),
    // Register Employee schema to resolve references
    MongooseModule.forFeature([
      { name: EmployeeProfile.name, schema: EmployeeProfileSchema },
    ]),
    AuthModule,
    RecruitmentModule,
    LeavesModule,
    OrganizationStructureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}