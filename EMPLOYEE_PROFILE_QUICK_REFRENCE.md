# Employee Profile Module - Quick Reference Guide

## 1. Employee Self-Service

### US-E2-04: View Full Employee Profile
**Requirements:**
- **US-E2-04:** As an employee, I want to view my full employee profile.
- **BR 2a-r:** System must record specific personal and job data.
- **NFR-14:** All users shall authenticate via secure login and role-based access control.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.getMyProfile` OR `getMe`
    - **Service:** `EmployeeProfileService.getMyProfile(employeeNumber, user)`
    - **Route:** `GET /employee-profile/:employeeNumber/my-profile`
    - **Access Control:** Checks if `user.employeeNumber === employeeNumber`.
- **Frontend:**
    - **Page:** `frontend/src/app/employee-profile/[id]/page.tsx` (Handles view logic)
    - **API Hook:** `useGetMyProfile` (inferred)

### US-E2-05 & US-E2-12: Update Personal Information (Immediate)
**Requirements:**
- **US-E2-05:** Update contact information (phone, address).
- **US-E2-12:** Add short biography and upload profile picture.
- **BR 2n, 2o, 2g:** Requirements for Phone, Email, and Address data.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.updateSelfImmediate`
    - **Service:** `EmployeeProfileService.updateEmployeeSelfImmediate`
    - **Route:** `PUT /employee-profile/:employeeNumber/my-profile/immediate`
    - **Allowed Fields:** `profilePictureUrl`, `biography`, `address`, `personalEmail`, `mobilePhone`
- **Frontend:**
    - **Component:** Profile Edit Form / Modal

### US-E6-02 & US-E2-06: Request Data Corrections (Change Requests)
**Requirements:**
- **US-E6-02:** Request corrections of data (e.g., job title, department).
- **US-E2-06:** Submit requests to change legal name or marital status.
- **BR 20a:** Only authorized roles can create and/or modify profile data.
- **BR 36:** All changes must be made via workflow approval.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.createChangeRequest` / `createLegalChangeRequest`
    - **Service:** `EmployeeProfileService.createChangeRequest`
    - **Route:** `POST .../change-request` & `POST .../legal-change-request`
    - **DTOs:** `CreateEmployeeChangeRequestDto`, `CreateLegalChangeRequestDto`

## 2. Manager Views

### US-E4-01 & US-E4-02: Team Management
**Requirements:**
- **US-E4-01:** View team members’ profiles (excluding sensitive info).
- **US-E4-02:** See a summary of my team’s job titles and departments.
- **BR 41b:** Direct Managers see their team only.
- **BR 18b:** Privacy restrictions for Department Managers on sensitive data.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.getEmployeesInMyDepartment`
    - **Service:** `EmployeeProfileService.getEmployeesInDepartment`
    - **Route:** `GET /employee-profile/my-employees`
    - **Access Control:** `Roles(SystemRole.DEPARTMENT_HEAD)`
- **Frontend:**
    - **View:** "My Team" or "Department" Dashboard

## 3. HR Administration

### US-EP-04 & US-E7-05: Edit Profile & Assign Roles
**Requirements:**
- **US-EP-04:** HR admin can edit any part of an employee’s profile.
- **US-E7-05:** Assign roles and access permissions.
- **BR 3j:** Employee status (Active, On Leave, etc.) controls system access.
- **BR 20a:** Only authorized roles can modify data.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.updateAdmin`
    - **Service:** `EmployeeProfileService.updateEmployeeAdmin`
    - **Route:** `PUT /employee-profile/:id/admin`
    - **Functionality:** Updates profile data, `roles`, and `permissions`.

### US-E2-03: Review Profile Change Requests
**Requirements:**
- **US-E2-03:** HR admin reviews and approves employee-submitted profile changes.
- **BR 22:** Trace changes in a timestamped manner.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.reviewCR`
    - **Service:** `EmployeeProfileService.reviewChangeRequest`
    - **Route:** `POST /employee-profile/change-request/:requestId/review`
    - **Actions:** `APPROVE` (applies patch), `REJECT`.

### US-EP-05: Deactivate Employee
**Requirements:**
- **US-EP-05:** Deactivate an employee’s profile upon termination/resignation.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.deactivateEmployee`
    - **Service:** `EmployeeProfileService.deactivateEmployee`
    - **Route:** `PATCH /employee-profile/:id/deactivate`

### US-E6-03: Search Employees
**Requirements:**
- **US-E6-03:** HR Admin to search for employees data.

**Implementation:**
- **Backend:**
    - **Controller:** `EmployeeProfileController.getAll`
    - **Service:** `EmployeeProfileService.getAllEmployees`
    - **Route:** `GET /employee-profile` (Returns list for search/grid)

## 4. System Configuration

### US-E7-04: Workflow Rules
**Requirements:**
- **US-E7-04:** System admin to configure workflow rules.

**Implementation:**
- **Backend:**
    - **Model:** `CompanyWideSettings` (Configures escalation days, etc.)
    - **Note:** Likely handled in a separate Settings module/controller but affects Change Request processing.
