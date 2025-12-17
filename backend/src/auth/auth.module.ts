import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { EmployeeProfileModule } from '../employee-profile/employee-profile.module';

import {
  EmployeeProfile,
  EmployeeProfileSchema,
} from '../employee-profile/Models/employee-profile.schema';

import {
  EmployeeSystemRole,
  EmployeeSystemRoleSchema,
} from '../employee-profile/Models/employee-system-role.schema';

import {
  Candidate,
  CandidateSchema,
} from '../employee-profile/Models/candidate.schema';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    //so AuthGuard('jwt') works
    PassportModule.register({ defaultStrategy: 'jwt' }),

    //load JWT_SECRET and allow JwtModule.registerAsync to work
    ConfigModule.forRoot(),

    forwardRef(() => EmployeeProfileModule),

    // Schemas used inside AuthService and JwtStrategy
    MongooseModule.forFeature([
      { name: EmployeeProfile.name, schema: EmployeeProfileSchema },
      { name: EmployeeSystemRole.name, schema: EmployeeSystemRoleSchema },
      { name: Candidate.name, schema: CandidateSchema },
    ]),

    // Load JWT secret dynamically
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],

  providers: [AuthService, JwtStrategy, RolesGuard],

  exports: [AuthService, PassportModule],
})
export class AuthModule {}
