import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeProfile } from '../../employee-profile/Models/employee-profile.schema';
import { EmployeeSystemRole } from '../../employee-profile/Models/employee-system-role.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,

    @InjectModel(EmployeeProfile.name)
    private profileModel: Model<EmployeeProfile>,

    @InjectModel(EmployeeSystemRole.name)
    private roleModel: Model<EmployeeSystemRole>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from Authorization Bearer header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Then try to extract from cookies
        (req) => {
          console.log('🔍 JWT Extractor - All cookies:', req?.cookies);
          console.log('🔍 JWT Extractor - Headers:', req?.headers?.cookie);
          const token = req?.cookies?.accessToken;
          console.log('🔍 JWT Extractor - accessToken:', token ? 'FOUND' : 'NOT FOUND');
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,       // VALID NOW
    } as StrategyOptionsWithRequest); // 👈 THIS FIXES THE ERROR
  }

  async validate(req: Request, payload: any) {
    console.log('JwtStrategy VALIDATE:', payload);

    return {
      id: payload.id,
      _id: payload.id, // Required by AuthenticatedUser type
      workEmail: payload.workEmail,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      primaryDepartmentId: payload.primaryDepartmentId,
      employeeNumber: payload.employeeNumber,
      candidateNumber: payload.candidateNumber,
      userType: payload.userType,
    };
  }
}
