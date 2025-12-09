import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { EmployeeProfile } from '../employee-profile/Models/employee-profile.schema';
import { EmployeeSystemRole } from '../employee-profile/Models/employee-system-role.schema';
import { RegisterEmployeeDto } from '../employee-profile/dto/register-employee.dto';
import { EmployeeProfileService } from '../employee-profile/employee-profile.service';
import { permission } from 'process';

type EmployeeDocument = HydratedDocument<EmployeeProfile>;
type RoleDocument = HydratedDocument<EmployeeSystemRole>;

@Injectable()
export class AuthService {
    constructor(
  private readonly jwtService: JwtService,

  @InjectModel(EmployeeProfile.name)
  private readonly employeeModel: Model<EmployeeProfile>,

  @InjectModel(EmployeeSystemRole.name)
  private readonly employeeRoleModel: Model<EmployeeSystemRole>,

  private readonly employeeProfileService: EmployeeProfileService, // MUST be last
) {}


    async register(dto: RegisterEmployeeDto) {
    // create employee with auto-generated employeeNumber
    const employee = await this.employeeProfileService.createEmployee(dto);

    // attach system role
    const roleDoc = await this.employeeRoleModel.create({
        employeeProfileId: employee._id,
        roles: dto.roles ?? [],
        permissions: dto.permissions ?? [],
    });

    // sign jwt
    const payload = {
        sub: employee._id,
        workEmail: employee.workEmail,
        roles: roleDoc.roles,
        permissions: roleDoc.permissions,
        employeeNumber: employee.employeeNumber,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
        accessToken,
        user: employee,
    };
}



    //LOGIN → returns JWT
    async login(user: EmployeeDocument & { systemRole: RoleDocument | null }) {

        const payload = {
            sub: user._id.toString(),
            workEmail: user.workEmail,
            roles: user.systemRole?.roles ?? [],
            permissions: user.systemRole?.permissions ?? [],
            primaryDepartmentId: user.primaryDepartmentId,
            employeeNumber: user.employeeNumber,
        };

        return {
        accessToken: this.jwtService.sign(payload),
        };
    }

    //VALIDATE EMPLOYEE LOGIN
    async validateEmployee(workEmail: string, password: string) {
        const employee = await this.employeeModel.findOne({ workEmail }).exec();
        if (!employee) return null;

        const isMatch = await bcrypt.compare(password, employee.password as string);
        if (!isMatch) return null;

        // Load roles
        const systemRole = await this.employeeRoleModel.findOne({
            employeeProfileId: employee._id,
        });
        console.log("VALIDATE EMPLOYEE - systemRole =", systemRole);

        // Return hydrated document + role
        return Object.assign(employee, { systemRole });
    }
}
