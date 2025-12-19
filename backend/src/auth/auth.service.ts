import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { CandidateStatus, EmployeeStatus } from '../employee-profile/enums/employee-profile.enums';

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
    ) { }


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
            // GDPR: Record consent date when candidate registers
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

        // Check if employee status allows login
        const inactiveStatuses = [
            EmployeeStatus.TERMINATED,
            EmployeeStatus.RETIRED,
            EmployeeStatus.SUSPENDED,
            EmployeeStatus.INACTIVE
        ];
        if (inactiveStatuses.includes(employee.status)) {
            throw new UnauthorizedException(
                `Access denied. Your account status is ${employee.status}. Please contact HR for assistance.`
            );
        }

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
    async getUserProfile(user: AuthenticatedUser) {
        console.log(`[AuthService] Fetching profile for user: ${user._id} type: ${user.userType}`);

        if (user.userType === UserType.EMPLOYEE) {
            const emp = await this.employeeModel.findById(user._id).select('profilePictureUrl firstName lastName workEmail mobilePhone').lean();
            console.log(`[AuthService] Found Employee:`, emp ? 'YES' : 'NO');
            console.log(`[AuthService] Employee data:`, emp);
            console.log(`[AuthService] Profile picture URL from DB:`, emp?.profilePictureUrl);
            const firstName = emp?.firstName || '';
            const lastName = emp?.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim() || 'Employee';

            const result = {
                ...user,
                profilePictureUrl: emp?.profilePictureUrl || null,
                name: fullName
            };
            console.log(`[AuthService] Returning result:`, result);
            return result;
        } else {
            const cand = await this.candidateModel.findById(user._id).select('profilePictureUrl firstName lastName personalEmail').lean();
            console.log(`[AuthService] Found Candidate:`, cand ? 'YES' : 'NO');
            const firstName = cand?.firstName || '';
            const lastName = cand?.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim() || 'Candidate';

            return {
                ...user,
                profilePictureUrl: cand?.profilePictureUrl || null,
                name: fullName
            };
        }
    }
}
