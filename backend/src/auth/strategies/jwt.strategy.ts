// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
// import { Request } from 'express';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EmployeeProfile } from '../../employee-profile/Models/employee-profile.schema';
// import { EmployeeSystemRole } from '../../employee-profile/Models/employee-system-role.schema';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private config: ConfigService,

//     @InjectModel(EmployeeProfile.name)
//     private profileModel: Model<EmployeeProfile>,

//     @InjectModel(EmployeeSystemRole.name)
//     private roleModel: Model<EmployeeSystemRole>,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         // (req) => req?.cookies?.accessToken,
//         (request: Request) => {
//           return request?.cookies?.accessToken; // Extract from 'accessToken' cookie
//         },
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: config.get<string>('JWT_SECRET'),
//       passReqToCallback: true,       // VALID NOW
//     } as StrategyOptionsWithRequest); // 👈 THIS FIXES THE ERROR
//   }

//   async validate(req: Request, payload: any) {
//     console.log('JwtStrategy VALIDATE:', payload);

//     return {
//       id: payload.sub,
//       workEmail: payload.workEmail,
//       roles: payload.roles ?? [],
//       permissions: payload.permissions ?? [],
//       primaryDepartmentId: payload.primaryDepartmentId,
//       employeeNumber: payload.employeeNumber,
//     };
//   }
// }
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
        // Custom extractor to debug token extraction
        (req) => {
          // Try Authorization header first
          const authHeader = req?.headers?.authorization;
          console.log('📋 Authorization header:', authHeader);
          
          if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7).trim();
            if (token && token !== 'undefined' && token.length > 20) {
              console.log('🔑 Extracted token from Authorization header');
              console.log('🔑 Token preview:', token.substring(0, 30) + '...');
              console.log('🔑 Full token length:', token.length);
              console.log('🔑 Token format check:', token.split('.').length === 3 ? 'Valid JWT format (3 parts)' : `Invalid format (${token.split('.').length} parts)`);
              return token;
            } else {
              console.log('❌ Invalid token extracted:', token);
              console.log('❌ Token is undefined or too short');
            }
          } else {
            console.log('❌ Authorization header missing or invalid format');
            console.log('📋 Header value:', authHeader);
            console.log('📋 Header type:', typeof authHeader);
          }
          
          // Fallback to cookie
          const cookieToken = req?.cookies?.accessToken;
          if (cookieToken && cookieToken !== 'undefined') {
            console.log('🔑 Extracted token from cookie');
            return cookieToken;
          }
          
          console.log('❌ No valid token found in Authorization header or cookies');
          console.log('📋 All request headers:', JSON.stringify(req?.headers, null, 2));
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: any) {
    console.log('JwtStrategy VALIDATE:', payload);

    return {
      id: payload.sub,
      workEmail: payload.workEmail,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      primaryDepartmentId: payload.primaryDepartmentId,
      employeeNumber: payload.employeeNumber,
    };
  }
}