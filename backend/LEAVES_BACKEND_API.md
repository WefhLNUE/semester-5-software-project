# Leaves Management Backend API Documentation

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Backend Framework:** NestJS + MongoDB (Mongoose)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Business Logic](#business-logic)
7. [Error Handling](#error-handling)
8. [Integration Points](#integration-points)

---

## Overview

The Leaves Management module handles the complete lifecycle of employee leave requests, from submission through approval workflows, balance tracking, policy management, and integration with payroll/time management systems.

### Key Features
- **Employee Self-Service**: Submit, modify, cancel leave requests
- **Multi-Level Approvals**: Manager → HR workflow with override capabilities
- **Balance Tracking**: Real-time leave balances with accrual automation
- **Policy Engine**: Flexible leave policies with eligibility rules
- **Irregular Pattern Detection**: Automated flagging of suspicious patterns
- **Payroll Integration**: Ready for payroll deduction processing

---

## Architecture

### Module Structure

```
backend/src/leaves/
├── leaves.module.ts          # Main module configuration
├── leaves.controller.ts      # Base controller (minimal)
├── leaves.service.ts         # Base service (minimal)
│
├── requests/                 # Leave request lifecycle
│   ├── requests.controller.ts
│   ├── requests.service.ts
│   └── dto/
│       ├── create-request.dto.ts
│       ├── update-request.dto.ts
│       ├── approve-request.dto.ts
│       ├── finalize-request.dto.ts
│       └── return-for-correction.dto.ts
│
├── tracking/                 # Balance tracking & history
│   ├── tracking.controller.ts
│   ├── tracking.service.ts
│   └── dto/
│       ├── balance-query.dto.ts
│       └── history-filter.dto.ts
│
├── type/                     # Leave type management
│   ├── type.controller.ts
│   ├── type.service.ts
│   └── dto/
│       ├── create-leave-type.dto.ts
│       └── update-leave-type.dto.ts
│
├── policy/                   # Policy configuration
│   ├── policy.controller.ts
│   ├── policy.service.ts
│   ├── dto/
│   └── helpers/
│       ├── accrual.helper.ts
│       ├── eligibility.helper.ts
│       └── rounding.helper.ts
│
├── escalation/               # Escalation rules
├── notifications/            # Notification service
├── calendars/               # Calendar service
├── holidays/                # Holiday management
│
├── Models/                  # Mongoose schemas
│   ├── leave-request.schema.ts
│   ├── leave-type.schema.ts
│   ├── leave-policy.schema.ts
│   ├── leave-entitlement.schema.ts
│   ├── leave-adjustment.schema.ts
│   ├── attachment.schema.ts
│   └── calendar.schema.ts
│
└── enums/                   # Enumerations
    ├── leave-status.enum.ts
    ├── adjustment-type.enum.ts
    ├── attachment-type.enum.ts
    └── rounding-rule.enum.ts
```

### Dependencies

```typescript
// Cross-module dependencies
- EmployeeProfileModule  // Employee data, organizational structure
- TimeManagementModule   // Holiday calendars, work schedules
- PayrollModule         // (Future) Payroll deduction integration
```

---

## Database Models

### LeaveRequest Schema

**Collection:** `leaverequests`

```typescript
{
  employeeId: ObjectId,           // ref: EmployeeProfile
  leaveTypeId: ObjectId,          // ref: LeaveType
  dates: {
    from: Date,
    to: Date
  },
  durationDays: Number,           // Calculated (excludes weekends/holidays)
  justification?: String,
  attachmentId?: ObjectId,        // ref: Document
  
  // Approval workflow history
  approvalFlow: [{
    role: String,                 // 'manager' | 'hr'
    status: String,               // 'pending' | 'approved' | 'rejected'
    decidedBy?: ObjectId,         // ref: EmployeeProfile
    decidedAt?: Date
  }],
  
  status: String,                 // LeaveStatus enum
  irregularPatternFlag: Boolean,
  
  // Audit fields (from @Schema({ timestamps: true }))
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `employeeId` (1)
- `status` (1)
- `dates.from` (1), `dates.to` (1)
- Compound: `{ employeeId: 1, status: 1 }`

---

### LeaveType Schema

**Collection:** `leavetypes`

```typescript
{
  code: String,                   // Unique: 'ANNUAL', 'SICK', 'MATERNITY'
  name: String,
  description?: String,
  requiresApproval: Boolean,
  requiresDocumentation: Boolean,
  paidLeave: Boolean,
  maxConsecutiveDays?: Number,
  minNoticeDays?: Number,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `code` (unique)

---

### LeavePolicy Schema

**Collection:** `leavepolicies`

```typescript
{
  leaveTypeId: ObjectId,          // ref: LeaveType
  effectiveDate: Date,
  expiryDate?: Date,
  
  // Entitlement rules
  entitlement: {
    annualDays: Number,           // Base entitlement per year
    accruedMonthly: Boolean,      // True = monthly accrual
    accrualRate?: Number          // Days per month if accruedMonthly
  },
  
  // Carryover rules
  carryover: {
    allowCarryover: Boolean,
    maxCarryoverDays?: Number,
    expiryMonths?: Number         // Carried days expire after X months
  },
  
  // Rounding rules
  rounding: {
    rule: String,                 // 'NONE' | 'ROUND_UP' | 'ROUND_DOWN' | 'NEAREST_HALF'
    minUnit?: Number              // Minimum leave unit (e.g., 0.5 days)
  },
  
  // Eligibility
  eligibility: {
    minTenureMonths?: Number,     // Minimum service period
    employeeTypes?: [String],     // ['PERMANENT', 'CONTRACT']
    departments?: [ObjectId],     // Specific departments
    excludeEmployees?: [ObjectId] // Blacklist
  },
  
  // Document requirements
  documentRules: {
    requiresDocumentAboveDays?: Number  // e.g., sick leave > 3 days
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

---

### LeaveEntitlement Schema

**Collection:** `leaveentitlements`

```typescript
{
  employeeId: ObjectId,           // ref: EmployeeProfile
  leaveTypeId: ObjectId,          // ref: LeaveType
  year: Number,                   // Fiscal year (e.g., 2024)
  
  totalEntitlement: Number,       // Total days allocated
  used: Number,                   // Days consumed
  pending: Number,                // Days in pending requests
  available: Number,              // Remaining available
  
  carriedOver: Number,            // From previous year
  carriedExpiry?: Date,           // Expiry date for carried days
  
  lastAccrualDate?: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Compound: `{ employeeId: 1, leaveTypeId: 1, year: 1 }` (unique)

---

### LeaveAdjustment Schema

**Collection:** `leaveadjustments`

```typescript
{
  employeeId: ObjectId,           // ref: EmployeeProfile
  leaveTypeId: ObjectId,          // ref: LeaveType
  year: Number,
  
  adjustmentType: String,         // 'ADDITION' | 'DEDUCTION' | 'CORRECTION'
  amount: Number,                 // Days (positive/negative)
  reason: String,
  approvedBy: ObjectId,           // ref: EmployeeProfile (HR/Admin)
  
  createdAt: Date,
  updatedAt: Date
}
```

---

### LeaveStatus Enum

```typescript
export enum LeaveStatus {
  PENDING = 'pending',            // Awaiting approval
  APPROVED = 'approved',          // Manager/HR approved
  REJECTED = 'rejected',          // Denied
  CANCELLED = 'cancelled',        // Cancelled by employee
  RETURNED = 'returned',          // Returned for correction
  FINALIZED = 'finalized'         // HR finalized (ready for payroll)
}
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 1. Leave Requests API

**Base Path:** `/leaves/requests`

### 1.1 Submit Leave Request

**Endpoint:** `POST /leaves/requests`  
**Auth:** Required  
**Roles:** All authenticated employees

**Request Body:**
```json
{
  "leaveTypeId": "507f1f77bcf86cd799439011",
  "dates": {
    "from": "2024-12-20T00:00:00.000Z",
    "to": "2024-12-27T00:00:00.000Z"
  },
  "justification": "Family vacation",
  "attachmentId": "507f1f77bcf86cd799439012"  // Optional
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "employeeId": "507f1f77bcf86cd799439010",
  "leaveTypeId": "507f1f77bcf86cd799439011",
  "dates": {
    "from": "2024-12-20T00:00:00.000Z",
    "to": "2024-12-27T00:00:00.000Z"
  },
  "durationDays": 6,
  "justification": "Family vacation",
  "status": "pending",
  "approvalFlow": [
    {
      "role": "manager",
      "status": "pending"
    }
  ],
  "irregularPatternFlag": false,
  "createdAt": "2024-12-15T10:30:00.000Z",
  "updatedAt": "2024-12-15T10:30:00.000Z"
}
```

**Business Rules:**
- `employeeId` forced from JWT (ignores body value)
- Duration calculated excluding weekends/holidays
- Validates sufficient leave balance
- Checks policy eligibility (tenure, employee type)
- Auto-flags irregular patterns (e.g., Friday + Monday)
- Creates approval workflow based on policy

**Error Responses:**
- `400 Bad Request` - Insufficient balance, invalid dates
- `403 Forbidden` - Not eligible for leave type
- `404 Not Found` - Leave type not found

---

### 1.2 Modify Pending Request

**Endpoint:** `PATCH /leaves/requests/:id`  
**Auth:** Required  
**Roles:** Request owner only

**Request Body:**
```json
{
  "dates": {
    "from": "2024-12-21T00:00:00.000Z",
    "to": "2024-12-27T00:00:00.000Z"
  },
  "justification": "Updated vacation dates"
}
```

**Response:** `200 OK` (updated LeaveRequest)

**Business Rules:**
- Only owner can modify
- Only `PENDING` or `RETURNED` status allowed
- Recalculates duration
- Resets approval flow if dates changed
- Re-validates balance

**Error Responses:**
- `403 Forbidden` - Not owner or wrong status
- `404 Not Found` - Request not found

---

### 1.3 Cancel Request

**Endpoint:** `DELETE /leaves/requests/:id/cancel`  
**Auth:** Required  
**Roles:** Request owner only

**Response:** `200 OK`
```json
{
  "message": "Leave request cancelled successfully",
  "request": { /* updated request with status: 'cancelled' */ }
}
```

**Business Rules:**
- Only owner can cancel
- Allowed in `PENDING` or `APPROVED` status
- Cancelling `APPROVED` requires manager notification
- Restores leave balance immediately
- Cannot cancel `FINALIZED` requests

---

### 1.4 Manager Approve

**Endpoint:** `POST /leaves/requests/:id/manager-approve`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`

**Request Body:**
```json
{
  "comments": "Approved - coverage arranged"
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "approved",
  "approvalFlow": [
    {
      "role": "manager",
      "status": "approved",
      "decidedBy": "507f1f77bcf86cd799439020",
      "decidedAt": "2024-12-15T14:00:00.000Z"
    },
    {
      "role": "hr",
      "status": "pending"
    }
  ],
  // ... rest of request
}
```

**Business Rules:**
- Manager must be employee's direct supervisor
- Status must be `PENDING`
- Moves to HR approval queue
- Sends notification to employee & HR
- Reserves leave balance (`pending` counter)

---

### 1.5 Manager Reject

**Endpoint:** `POST /leaves/requests/:id/manager-reject`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`

**Request Body:**
```json
{
  "reason": "Insufficient coverage during period",
  "comments": "Please reschedule to January"
}
```

**Response:** `200 OK`

**Business Rules:**
- Reason required
- Sets status to `REJECTED`
- Restores leave balance
- Sends notification to employee

---

### 1.6 Return for Correction

**Endpoint:** `POST /leaves/requests/:id/return-for-correction`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "reason": "MISSING_DOCUMENTATION",
  "comment": "Please upload medical certificate"
}
```

**Response:** `200 OK`

**Business Rules:**
- Sets status to `RETURNED`
- Employee can resubmit after corrections
- Balance remains reserved
- Sends notification to employee

---

### 1.7 Resubmit After Correction

**Endpoint:** `POST /leaves/requests/:id/resubmit`  
**Auth:** Required  
**Roles:** Request owner only

**Response:** `200 OK`

**Business Rules:**
- Only allowed if status is `RETURNED`
- Resets to `PENDING` status
- Re-enters approval workflow
- Validates corrections applied

---

### 1.8 HR Finalize

**Endpoint:** `POST /leaves/requests/:id/hr-finalize`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "paidDays": 6,
  "unpaidDays": 0,
  "comments": "Verified and approved for payroll",
  "integrationData": {
    "payrollPeriod": "2024-12",
    "deductionCode": "LEAVE_ANNUAL"
  }
}
```

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "status": "finalized",
  "approvalFlow": [
    {
      "role": "manager",
      "status": "approved",
      "decidedBy": "507f1f77bcf86cd799439020",
      "decidedAt": "2024-12-15T14:00:00.000Z"
    },
    {
      "role": "hr",
      "status": "approved",
      "decidedBy": "507f1f77bcf86cd799439025",
      "decidedAt": "2024-12-16T09:00:00.000Z"
    }
  ],
  "finalizationDetails": {
    "paidDays": 6,
    "unpaidDays": 0,
    "finalizedBy": "507f1f77bcf86cd799439025",
    "finalizedAt": "2024-12-16T09:00:00.000Z",
    "integrationData": { /* ... */ }
  }
}
```

**Business Rules:**
- Must be in `APPROVED` status
- Deducts from `used` balance
- Sends to payroll integration queue
- Cannot be modified after finalization
- Generates audit trail

---

### 1.9 HR Override Manager Decision

**Endpoint:** `POST /leaves/requests/:id/hr-override`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "overrideReason": "POLICY_EXCEPTION",
  "comments": "Approved as special case - medical emergency",
  "paidDays": 3,
  "unpaidDays": 0
}
```

**Response:** `200 OK`

**Business Rules:**
- Can override `REJECTED` requests
- Requires override reason
- Logs override in approval flow
- Sends notifications to all parties
- Used for policy exceptions

---

### 1.10 Verify Medical Documents

**Endpoint:** `GET /leaves/requests/:id/verify-medical`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Response:** `200 OK`
```json
{
  "requestId": "507f1f77bcf86cd799439013",
  "leaveType": "SICK",
  "attachments": [
    {
      "id": "507f1f77bcf86cd799439030",
      "type": "MEDICAL_CERTIFICATE",
      "filename": "medical_cert_2024.pdf",
      "uploadedAt": "2024-12-15T10:35:00.000Z",
      "verifiedBy": null,
      "verifiedAt": null
    }
  ],
  "verificationStatus": "PENDING"
}
```

**Business Rules:**
- Returns medical documents for verification
- HR can approve/reject documents
- Affects leave approval decision

---

### 1.11 Bulk Process Requests

**Endpoint:** `POST /leaves/requests/bulk-process`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "requestIds": [
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015"
  ],
  "action": "APPROVE",  // or 'REJECT', 'FINALIZE'
  "comments": "Batch approval for year-end requests"
}
```

**Response:** `200 OK`
```json
{
  "processed": 3,
  "successful": 2,
  "failed": 1,
  "results": [
    {
      "requestId": "507f1f77bcf86cd799439013",
      "status": "success"
    },
    {
      "requestId": "507f1f77bcf86cd799439014",
      "status": "success"
    },
    {
      "requestId": "507f1f77bcf86cd799439015",
      "status": "failed",
      "error": "Insufficient balance"
    }
  ]
}
```

---

### 1.12 Get Integration Details

**Endpoint:** `GET /leaves/requests/:id/integration-details`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Response:** `200 OK`
```json
{
  "requestId": "507f1f77bcf86cd799439013",
  "employeeId": "507f1f77bcf86cd799439010",
  "payrollEmployeeCode": "EMP001",
  "leaveType": {
    "code": "ANNUAL",
    "paidLeave": true
  },
  "dates": {
    "from": "2024-12-20",
    "to": "2024-12-27"
  },
  "durationDays": 6,
  "paidDays": 6,
  "unpaidDays": 0,
  "payrollPeriod": "2024-12",
  "deductionCode": "LEAVE_ANNUAL",
  "integrationStatus": "READY",
  "finalizedAt": "2024-12-16T09:00:00.000Z"
}
```

---

## 2. Balance Tracking API

**Base Path:** `/leaves/tracking`

### 2.1 Get My Balances

**Endpoint:** `GET /leaves/tracking/me/balances`  
**Auth:** Required  
**Roles:** All authenticated employees

**Query Parameters:**
- `year` (optional) - Defaults to current year
- `leaveTypeId` (optional) - Filter by leave type

**Response:** `200 OK`
```json
{
  "employeeId": "507f1f77bcf86cd799439010",
  "year": 2024,
  "balances": [
    {
      "leaveType": {
        "id": "507f1f77bcf86cd799439011",
        "code": "ANNUAL",
        "name": "Annual Leave"
      },
      "totalEntitlement": 20,
      "used": 8,
      "pending": 6,
      "available": 6,
      "carriedOver": 2,
      "carriedExpiry": "2024-03-31T00:00:00.000Z"
    },
    {
      "leaveType": {
        "id": "507f1f77bcf86cd799439012",
        "code": "SICK",
        "name": "Sick Leave"
      },
      "totalEntitlement": 12,
      "used": 3,
      "pending": 0,
      "available": 9,
      "carriedOver": 0
    }
  ]
}
```

**Business Rules:**
- `employeeId` forced from JWT
- Shows real-time balances
- Includes carried-over days with expiry
- Pending = days in pending/approved requests

---

### 2.2 Get My Leave History

**Endpoint:** `GET /leaves/tracking/me/history`  
**Auth:** Required  
**Roles:** All authenticated employees

**Query Parameters:**
- `startDate` (optional) - ISO date string
- `endDate` (optional) - ISO date string
- `leaveTypeId` (optional)
- `status` (optional) - Filter by status
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** `200 OK`
```json
{
  "employeeId": "507f1f77bcf86cd799439010",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  },
  "history": [
    {
      "requestId": "507f1f77bcf86cd799439013",
      "leaveType": "Annual Leave",
      "dates": {
        "from": "2024-12-20",
        "to": "2024-12-27"
      },
      "durationDays": 6,
      "status": "finalized",
      "submittedAt": "2024-12-15T10:30:00.000Z",
      "finalizedAt": "2024-12-16T09:00:00.000Z"
    },
    // ... more history entries
  ]
}
```

---

### 2.3 Get Team Balances

**Endpoint:** `GET /leaves/tracking/team/balances`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`

**Query Parameters:**
- `year` (optional)
- `departmentId` (optional) - For HR filtering by department

**Response:** `200 OK`
```json
{
  "managerId": "507f1f77bcf86cd799439020",
  "year": 2024,
  "teamMembers": [
    {
      "employeeId": "507f1f77bcf86cd799439010",
      "name": "John Doe",
      "department": "Engineering",
      "balances": [
        {
          "leaveType": "Annual Leave",
          "totalEntitlement": 20,
          "used": 8,
          "pending": 6,
          "available": 6
        }
      ]
    }
    // ... more team members
  ]
}
```

---

### 2.4 Get Team History

**Endpoint:** `GET /leaves/tracking/team/history`  
**Auth:** Required  
**Roles:** `DEPARTMENT_HEAD`, `HR_MANAGER`

**Query Parameters:**
- `startDate`, `endDate`, `leaveTypeId`, `status`
- `employeeId` (optional) - Filter specific employee
- `page`, `limit`

**Response:** Similar to "Get My History" but for all team members

---

### 2.5 Flag Irregular Pattern

**Endpoint:** `POST /leaves/tracking/flag-irregular`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "requestId": "507f1f77bcf86cd799439013"
}
```

**Response:** `200 OK`
```json
{
  "requestId": "507f1f77bcf86cd799439013",
  "irregularPatternFlag": true,
  "patternDetails": {
    "type": "FREQUENT_SICK_LEAVE",
    "occurrences": 5,
    "period": "Last 3 months",
    "flaggedAt": "2024-12-16T10:00:00.000Z"
  }
}
```

**Pattern Detection Rules:**
- Sick leave every Friday/Monday
- Excessive sick leave frequency
- Leaves before/after holidays
- Suspicious patterns flagged for review

---

### 2.6 Run Accrual Job

**Endpoint:** `POST /leaves/tracking/run-accrual`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Response:** `200 OK`
```json
{
  "jobId": "accrual-2024-12-16",
  "executedAt": "2024-12-16T00:00:00.000Z",
  "employeesProcessed": 150,
  "entitlementsUpdated": 150,
  "errors": 0
}
```

**Business Logic:**
- Runs monthly (typically scheduled)
- Accrues leave based on policy (monthly/annual)
- Updates `LeaveEntitlement` records
- Logs accrual history
- Can be manually triggered by HR

---

### 2.7 Run Carry-Forward Job

**Endpoint:** `POST /leaves/tracking/run-carry-forward`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Response:** `200 OK`
```json
{
  "jobId": "carryforward-2025-01-01",
  "executedAt": "2025-01-01T00:00:00.000Z",
  "employeesProcessed": 150,
  "totalDaysCarried": 350,
  "expiredDays": 45
}
```

**Business Logic:**
- Runs annually (typically Jan 1)
- Carries forward unused leave per policy
- Applies max carryover limits
- Sets expiry dates for carried days
- Creates new entitlements for new year

---

## 3. Leave Type Management API

**Base Path:** `/leave-types`

### 3.1 Create Leave Type

**Endpoint:** `POST /leave-types`  
**Auth:** Required  
**Roles:** `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "code": "BEREAVEMENT",
  "name": "Bereavement Leave",
  "description": "Leave for immediate family member death",
  "requiresApproval": true,
  "requiresDocumentation": true,
  "paidLeave": true,
  "maxConsecutiveDays": 5,
  "minNoticeDays": 0
}
```

**Response:** `201 Created`

---

### 3.2 Get All Leave Types

**Endpoint:** `GET /leave-types`  
**Auth:** Required  
**Roles:** All authenticated

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "code": "ANNUAL",
    "name": "Annual Leave",
    "requiresApproval": true,
    "paidLeave": true
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "code": "SICK",
    "name": "Sick Leave",
    "requiresApproval": false,
    "requiresDocumentation": true,
    "paidLeave": true
  }
  // ... more types
]
```

---

### 3.3 Get Leave Type by ID

**Endpoint:** `GET /leave-types/:id`  
**Auth:** Required  
**Roles:** All authenticated

---

### 3.4 Update Leave Type

**Endpoint:** `PATCH /leave-types/:id`  
**Auth:** Required  
**Roles:** `HR_ADMIN`, `SYSTEM_ADMIN`

---

### 3.5 Delete Leave Type

**Endpoint:** `DELETE /leave-types/:id`  
**Auth:** Required  
**Roles:** `HR_ADMIN`, `SYSTEM_ADMIN`

**Business Rules:**
- Cannot delete if active requests exist
- Soft delete recommended (set `active: false`)

---

## 4. Leave Policy Management API

**Base Path:** `/leave-policies`

### 4.1 Create Policy

**Endpoint:** `POST /leave-policies`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Request Body:**
```json
{
  "leaveTypeId": "507f1f77bcf86cd799439011",
  "effectiveDate": "2024-01-01",
  "entitlement": {
    "annualDays": 20,
    "accruedMonthly": false
  },
  "carryover": {
    "allowCarryover": true,
    "maxCarryoverDays": 5,
    "expiryMonths": 3
  },
  "rounding": {
    "rule": "NEAREST_HALF",
    "minUnit": 0.5
  },
  "eligibility": {
    "minTenureMonths": 3,
    "employeeTypes": ["PERMANENT", "CONTRACT"]
  },
  "documentRules": {
    "requiresDocumentAboveDays": 3
  }
}
```

**Response:** `201 Created`

---

### 4.2 Get All Policies

**Endpoint:** `GET /leave-policies`  
**Auth:** Required  
**Roles:** All authenticated

---

### 4.3 Get Policy by ID

**Endpoint:** `GET /leave-policies/:id`

---

### 4.4 Update Policy

**Endpoint:** `PATCH /leave-policies/:id`  
**Auth:** Required  
**Roles:** `HR_MANAGER`, `HR_ADMIN`, `SYSTEM_ADMIN`

**Business Rules:**
- Creates new version if affecting active entitlements
- Old policy marked with `expiryDate`
- Employees notified of policy changes

---

### 4.5 Delete Policy

**Endpoint:** `DELETE /leave-policies/:id`  
**Auth:** Required  
**Roles:** `HR_ADMIN`, `SYSTEM_ADMIN`

---

## Authentication & Authorization

### JWT Token Structure

```typescript
{
  "_id": "507f1f77bcf86cd799439010",
  "email": "john.doe@company.com",
  "role": "DEPARTMENT_EMPLOYEE",
  "departmentId": "507f1f77bcf86cd799439050",
  "managerId": "507f1f77bcf86cd799439020",
  "iat": 1702730000,
  "exp": 1702816400
}
```

### Role Hierarchy

```
SYSTEM_ADMIN          // Full access
└── HR_ADMIN          // HR module administration
    └── HR_MANAGER    // HR operations + team management
        └── DEPARTMENT_HEAD   // Manager operations
            └── HR_EMPLOYEE   // Basic operations
                └── DEPARTMENT_EMPLOYEE  // Self-service only
```

### Guards

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(SystemRole.HR_MANAGER, SystemRole.HR_ADMIN)
```

---

## Business Logic

### Leave Balance Calculation

```typescript
// Real-time balance calculation
available = totalEntitlement + carriedOver - used - pending

// Where:
// - totalEntitlement: Annual allocation
// - carriedOver: Previous year's unused days (with expiry)
// - used: Finalized (taken) leave days
// - pending: Days in pending/approved requests
```

### Duration Calculation

```typescript
// Exclude weekends and holidays
function calculateDuration(fromDate: Date, toDate: Date): number {
  let duration = 0;
  const current = new Date(fromDate);
  
  while (current <= toDate) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = await holidayService.isHoliday(current);
    
    if (!isWeekend && !isHoliday) {
      duration += 1;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return duration;
}
```

### Approval Workflow

```typescript
// Standard workflow
1. Employee submits → status: PENDING
2. Manager reviews → status: APPROVED or REJECTED
3. HR finalizes → status: FINALIZED
4. Payroll integration → exported to payroll

// HR Override workflow
1. Manager rejects
2. HR overrides → status: APPROVED
3. HR finalizes → status: FINALIZED
```

### Accrual Logic

```typescript
// Monthly accrual example
if (policy.entitlement.accruedMonthly) {
  const monthlyAccrual = policy.entitlement.annualDays / 12;
  entitlement.totalEntitlement += monthlyAccrual;
  entitlement.available += monthlyAccrual;
}

// Annual allocation
else {
  entitlement.totalEntitlement = policy.entitlement.annualDays;
  entitlement.available = policy.entitlement.annualDays;
}
```

### Carryover Logic

```typescript
// Year-end carryover
const unusedDays = entitlement.available;
const maxCarry = policy.carryover.maxCarryoverDays;
const carriedDays = Math.min(unusedDays, maxCarry);

// Create new entitlement for next year
const newEntitlement = {
  year: nextYear,
  totalEntitlement: policy.entitlement.annualDays,
  carriedOver: carriedDays,
  carriedExpiry: addMonths(new Date(), policy.carryover.expiryMonths),
  available: policy.entitlement.annualDays + carriedDays
};
```

---

## Error Handling

### Standard Error Response

```json
{
  "statusCode": 400,
  "message": "Insufficient leave balance",
  "error": "Bad Request",
  "details": {
    "required": 6,
    "available": 3,
    "leaveType": "Annual Leave"
  },
  "timestamp": "2024-12-16T10:00:00.000Z",
  "path": "/leaves/requests"
}
```

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Insufficient balance | Not enough leave days available |
| 400 | Invalid date range | From date after to date, or past dates |
| 403 | Not authorized | Wrong role or not request owner |
| 403 | Not eligible | Employee doesn't meet policy criteria |
| 404 | Request not found | Invalid request ID |
| 404 | Leave type not found | Invalid leave type ID |
| 409 | Overlapping request | Dates conflict with existing request |
| 422 | Missing documentation | Required documents not uploaded |
| 422 | Cannot modify finalized | Request already processed |

---

## Integration Points

### 1. Employee Profile Module

**Dependencies:**
- Employee data (name, department, hire date)
- Manager hierarchy
- Employment type (permanent/contract)

**Usage:**
```typescript
// Validate manager relationship
const employee = await employeeService.findById(employeeId);
const isDirectReport = employee.managerId === approverId;

// Check eligibility
const tenure = calculateTenure(employee.hireDate);
const isEligible = tenure >= policy.eligibility.minTenureMonths;
```

---

### 2. Time Management Module

**Dependencies:**
- Holiday calendars
- Work schedules
- Attendance tracking

**Usage:**
```typescript
// Calculate working days
const holidays = await holidayService.getHolidays(fromDate, toDate);
const workingDays = calculateDuration(fromDate, toDate, holidays);

// Check attendance conflicts
const attendance = await attendanceService.getAttendance(employeeId, fromDate, toDate);
```

---

### 3. Payroll Module (Future)

**Integration Data Export:**
```typescript
{
  "employeeId": "507f1f77bcf86cd799439010",
  "payrollEmployeeCode": "EMP001",
  "payrollPeriod": "2024-12",
  "leaveDeductions": [
    {
      "leaveType": "ANNUAL",
      "code": "LEAVE_ANNUAL",
      "days": 6,
      "paidDays": 6,
      "unpaidDays": 0,
      "amount": 0,  // Paid leave = no deduction
      "dates": {
        "from": "2024-12-20",
        "to": "2024-12-27"
      }
    }
  ]
}
```

**Export Endpoint:**
```
GET /leaves/requests/payroll-export?period=2024-12
```

---

### 4. Notification Service

**Events Triggering Notifications:**
- Request submitted → Manager
- Request approved/rejected → Employee
- Request requires action → Manager/HR
- Request finalized → Employee + Payroll
- Balance low warning → Employee
- Accrual processed → Employee (optional)

**Notification Channels:**
- In-app notifications
- Email
- SMS (for urgent approvals)

---

## Database Indexes

### Performance Optimization

```typescript
// LeaveRequest collection
db.leaverequests.createIndex({ employeeId: 1, status: 1 });
db.leaverequests.createIndex({ status: 1, createdAt: -1 });
db.leaverequests.createIndex({ "dates.from": 1, "dates.to": 1 });

// LeaveEntitlement collection
db.leaveentitlements.createIndex({ employeeId: 1, year: 1, leaveTypeId: 1 }, { unique: true });
db.leaveentitlements.createIndex({ year: 1 });

// LeaveType collection
db.leavetypes.createIndex({ code: 1 }, { unique: true });

// LeavePolicy collection
db.leavepolicies.createIndex({ leaveTypeId: 1, effectiveDate: -1 });
```

---

## Testing Checklist

### Unit Tests
- ✅ Duration calculation (exclude weekends/holidays)
- ✅ Balance calculations (real-time)
- ✅ Eligibility validation
- ✅ Approval workflow state transitions
- ✅ Accrual calculations
- ✅ Carryover logic

### Integration Tests
- ✅ Submit request → Manager approve → HR finalize workflow
- ✅ Insufficient balance rejection
- ✅ Overlapping request detection
- ✅ HR override manager rejection
- ✅ Cancel approved request (balance restoration)
- ✅ Bulk processing

### E2E Tests
- ✅ Complete leave request lifecycle
- ✅ Cross-module integration (Employee + Time Management)
- ✅ Notification delivery
- ✅ Payroll export generation

---

## Deployment Notes

### Environment Variables

```env
# Database
MONGO_URI=mongodb://localhost:27017/hrms
MONGO_DB_NAME=hrms

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d

# Email (for notifications)
SMTP_HOST=smtp.company.com
SMTP_PORT=587
SMTP_USER=noreply@company.com
SMTP_PASS=smtp-password

# Scheduled Jobs
ACCRUAL_CRON_SCHEDULE=0 0 1 * *     # 1st of every month
CARRYFORWARD_CRON_SCHEDULE=0 0 1 1 * # Jan 1st annually
```

### Scheduled Jobs

```typescript
// src/leaves/tracking/tracking.service.ts

@Cron('0 0 1 * *')  // Monthly accrual
async runMonthlyAccrual() {
  await this.trackingService.runAccrualJob();
}

@Cron('0 0 1 1 *')  // Annual carryforward
async runAnnualCarryForward() {
  await this.trackingService.runCarryForwardJob();
}
```

---

## API Rate Limits

```typescript
// Recommended rate limits
- Standard endpoints: 100 requests/minute per user
- Bulk operations: 10 requests/minute per user
- Export endpoints: 5 requests/minute per user
```

---

## Changelog

### Version 1.0.0 (December 2024)
- Initial API implementation
- Complete CRUD for leave requests
- Approval workflow (Manager → HR)
- Balance tracking with accrual
- Policy management
- Irregular pattern detection
- Integration readiness (Payroll)

---

## Support & Contact

**Backend Team Lead:** [Your Name]  
**Email:** backend-team@company.com  
**Slack:** #hrms-backend  
**Documentation:** [Internal Wiki Link]

---

**End of Documentation**
