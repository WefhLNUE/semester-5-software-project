import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { EmployeeProfile } from '../employee-profile/Models/employee-profile.schema';
import { EmployeeSystemRole } from '../employee-profile/Models/employee-system-role.schema';
import { Candidate } from '../employee-profile/Models/candidate.schema';
import { RegisterEmployeeDto } from '../employee-profile/dto/register-employee.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { EmployeeProfileService } from '../employee-profile/employee-profile.service';
import { UserType } from './dto/login.dto';
import { CandidateStatus } from '../employee-profile/enums/employee-profile.enums';

type RoleDocument = HydratedDocument<EmployeeSystemRole>;

// Common user type for login response
export type AuthenticatedUser = {
  _id: any;
  workEmail?: string;
  personalEmail?: string;
  userType: UserType;
  systemRole?: RoleDocument | null;
  candidateNumber?: string;
  employeeNumber?: string;
  primaryDepartmentId?: any;
};

@Injectable()
export class AuthService {
    constructor(
  private readonly jwtService: JwtService,

  @InjectModel(EmployeeProfile.name)
  private readonly employeeModel: Model<EmployeeProfile>,

  @InjectModel(EmployeeSystemRole.name)
  private readonly employeeRoleModel: Model<EmployeeSystemRole>,

  @InjectModel(Candidate.name)
  private readonly candidateModel: Model<Candidate>,

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
        id: employee._id,
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

    async registerCandidate(dto: RegisterCandidateDto) {
        const candidateNumber = `CAND-${Date.now()}`;

        const candidate = await this.candidateModel.create({
            ...dto,
            candidateNumber,
            applicationDate: new Date(),
            status: CandidateStatus.APPLIED,
        });

        const payload = {
            id: candidate._id.toString(),
            workEmail: candidate.personalEmail,
            roles: [],
            permissions: [],
            candidateNumber: candidate.candidateNumber,
            userType: UserType.CANDIDATE,
        };

        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: candidate,
        };
    }



    //LOGIN → returns JWT
    async login(user: AuthenticatedUser) {
        const payload = {
            id: user._id.toString(),
            workEmail: user.workEmail || user.personalEmail,
            roles: user.systemRole?.roles ?? [],
            permissions: user.systemRole?.permissions ?? [],
            primaryDepartmentId: user.primaryDepartmentId,
            employeeNumber: user.employeeNumber,
            candidateNumber: user.candidateNumber,
            userType: user.userType,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    // DRY: Shared validation logic for both employee and candidate
    private async validateUserCredentials(
        model: Model<any>,
        email: string,
        password: string,
        emailField: 'workEmail' | 'personalEmail' = 'workEmail',
    ): Promise<any | null> {
        const user = await model.findOne({ [emailField]: email }).exec();
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) return null;

        return user;
    }

    // Unified validate method that handles both user types
    async validateUser(email: string, password: string, userType: UserType): Promise<AuthenticatedUser | null> {
        if (userType === UserType.EMPLOYEE) {
            return this.validateEmployee(email, password);
        } else {
            return this.validateCandidate(email, password);
        }
    }

    //VALIDATE EMPLOYEE LOGIN
    async validateEmployee(workEmail: string, password: string): Promise<AuthenticatedUser | null> {
        const employee = await this.validateUserCredentials(
            this.employeeModel,
            workEmail,
            password,
            'workEmail',
        );
        if (!employee) return null;

        // Load roles
        const systemRole = await this.employeeRoleModel.findOne({
            employeeProfileId: employee._id,
        });
        console.log("VALIDATE EMPLOYEE - systemRole =", systemRole);

        return {
            _id: employee._id,
            workEmail: employee.workEmail,
            userType: UserType.EMPLOYEE,
            systemRole,
            employeeNumber: employee.employeeNumber,
            primaryDepartmentId: employee.primaryDepartmentId,
        };
    }

    //VALIDATE CANDIDATE LOGIN
    async validateCandidate(email: string, password: string): Promise<AuthenticatedUser | null> {
        const candidate = await this.validateUserCredentials(
            this.candidateModel,
            email,
            password,
            'personalEmail',
        );
        if (!candidate) return null;

        return {
            _id: candidate._id,
            personalEmail: candidate.personalEmail,
            userType: UserType.CANDIDATE,
            systemRole: null,
            candidateNumber: candidate.candidateNumber,
        };
    }
}
