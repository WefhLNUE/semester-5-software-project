// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import {UserProfileBaseSchema} from '../../employee-profile/models/user-schema'
// import { InjectModel } from '@nestjs/mongoose';
// //import { EmployeeProfile } from 'src/employee-profile/models/employee-profile.schema';
// import { EmployeeSystemRole } from 'src/employee-profile/models/employee-system-role.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//     constructor(
//         @InjectModel(EmployeeSystemRole.name)
//         private readonly employeeRoleModel: Model<EmployeeSystemRole>,
//     ) {
//         console.log('JwtStrategy: constructor called — strategy registering');
//         super({
//             jwtFromRequest: ExtractJwt.fromExtractors([
//                 // (req) => req?.cookies?.accessToken,
//                 (req) =>{
//                     try{
//                         console.log('JwtStrategy extractor - req.cookies:', req?.cookies);
//                     } catch (e){
//                         console.log('JwtStrategy extractor - no req available');
//                     }
//                     return req?.cookies?.accessToken;
//                 },
//                 ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ]),
//             ignoreExpiration: false,
//             secretOrKey: process.env.JWT_SECRET as string,
//         });
//     }

//     // @InjectModel(EmployeeProfile.name)
//     // private readonly employeeModel : Model<EmployeeProfile>;

//     async validate(payload: any) {
//         console.log('JwtStrategy LOADED');

//         const systemRole = await this.employeeRoleModel
//             .findOne({ employeeProfileId: payload.sub }) // 👉 correct query
//             .populate('employeeProfileId')               // 👉 correct populate
//             .exec();

//         if (!systemRole || !systemRole.employeeProfileId) {
//             return null;
//         }

//         const employee = systemRole.employeeProfileId as any;
//         console.log("JWT payload:", payload);
//         console.log("Employee from JWT:", employee);
//         return {
//             id: employee._id,
//             workEmail: employee.workEmail ?? null,
//             primaryDepartmentId: employee.primaryDepartmentId ?? null,
//             primaryPositionId: employee.primaryPositionId ?? null,
//             roles: payload.roles,
//             permissions: systemRole.permissions,
//         };
//     }

// }
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeProfile } from '../../employee-profile/models/employee-profile.schema';
import { EmployeeSystemRole } from '../../employee-profile/models/employee-system-role.schema';
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
        (req) => req?.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      passReqToCallback: true,       // VALID NOW
    } as StrategyOptionsWithRequest); // 👈 THIS FIXES THE ERROR
  }

  async validate(req: Request, payload: any) {
    console.log('JwtStrategy VALIDATE:', payload);

    return {
      id: payload.sub,
      workEmail: payload.workEmail,
      roles: payload.roles ?? [],
      permissions: payload.permissions ?? [],
      primaryDepartmentId: payload.primaryDepartmentId,
    };
  }
}
