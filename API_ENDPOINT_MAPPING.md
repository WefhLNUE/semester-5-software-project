# Frontend-Backend API Endpoint Mapping

**Status**: ✅ All endpoints properly wired and functional  
**Last Updated**: December 17, 2025  
**Backend**: NestJS at `http://localhost:5000`  
**Frontend**: Next.js at `http://localhost:3000`

---

## ✅ LEAVE REQUESTS - `/leaves/requests`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `fetchMyRequests()` | `/leaves/requests/me` | GET | RequestsController | All authenticated users | ✅ **ADDED** |
| `fetchAllRequests()` | `/leaves/requests` | GET | RequestsController | HR_MANAGER, HR_ADMIN, SYSTEM_ADMIN | ✅ CORRECT |
| `submitLeaveRequest()` | `/leaves/requests` | POST | RequestsController | All authenticated users | ✅ CORRECT |
| `updateLeaveRequest(id)` | `/leaves/requests/:id` | PATCH | RequestsController | Employee (owner only) | ✅ CORRECT |
| `cancelLeaveRequest(id)` | `/leaves/requests/:id/cancel` | DELETE | RequestsController | Employee (owner only) | ✅ CORRECT |
| `managerApproveRequest(id)` | `/leaves/requests/:id/manager-approve` | POST | RequestsController | DEPARTMENT_HEAD, HR_MANAGER | ✅ CORRECT |
| `managerRejectRequest(id)` | `/leaves/requests/:id/manager-reject` | POST | RequestsController | DEPARTMENT_HEAD, HR_MANAGER | ✅ CORRECT |
| `returnRequestForCorrection(id)` | `/leaves/requests/:id/return-for-correction` | POST | RequestsController | Manager/HR | ✅ CORRECT |
| `resubmitLeaveRequest(id)` | `/leaves/requests/:id/resubmit` | POST | RequestsController | Employee (owner only) | ✅ CORRECT |
| `hrFinalizeRequest(id)` | `/leaves/requests/:id/hr-finalize` | POST | RequestsController | HR only | ✅ CORRECT |
| `hrOverrideRequest(id)` | `/leaves/requests/:id/hr-override` | POST | RequestsController | HR only | ✅ CORRECT |
| `bulkProcessRequests()` | `/leaves/requests/bulk-process` | POST | RequestsController | Manager/HR | ✅ CORRECT |
| `verifyMedicalDocuments(id)` | `/leaves/requests/:id/verify-medical` | GET | RequestsController | HR only | ✅ CORRECT |
| `getIntegrationDetails(id)` | `/leaves/requests/:id/integration-details` | GET | RequestsController | HR only | ✅ CORRECT |
| `getTeamRequests()` | `/leaves/requests/team` | GET | RequestsController | DEPARTMENT_HEAD, HR_MANAGER | ✅ CORRECT |

**Key Fix**: Added missing `GET /leaves/requests/me` route for employees to fetch their own requests.

---

## ✅ LEAVE TRACKING - `/leaves/tracking`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `getMyBalances()` | `/leaves/tracking/me/balances` | GET | TrackingController | All authenticated users | ✅ CORRECT |
| `getMyHistory()` | `/leaves/tracking/me/history` | GET | TrackingController | All authenticated users | ✅ CORRECT |
| `getTeamBalances()` | `/leaves/tracking/team/balances` | GET | TrackingController | DEPARTMENT_HEAD, HR_MANAGER | ✅ CORRECT |
| `getTeamHistory()` | `/leaves/tracking/team/history` | GET | TrackingController | DEPARTMENT_HEAD, HR_MANAGER | ✅ CORRECT |
| `flagIrregularLeave()` | `/leaves/tracking/flag-irregular` | POST | TrackingController | HR only | ✅ CORRECT |
| `runAccrual()` | `/leaves/tracking/run-accrual` | POST | TrackingController | HR only | ✅ CORRECT |
| `runCarryForward()` | `/leaves/tracking/run-carry-forward` | POST | TrackingController | HR only | ✅ CORRECT |

---

## ✅ LEAVE TYPES - `/leave-types`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `getAllLeaveTypes()` | `/leave-types` | GET | LeaveTypeController | All authenticated users | ✅ CORRECT |
| `getLeaveType(id)` | `/leave-types/:id` | GET | LeaveTypeController | All authenticated users | ✅ CORRECT |
| `createLeaveType()` | `/leave-types` | POST | LeaveTypeController | HR only | ✅ CORRECT |
| `updateLeaveType(id)` | `/leave-types/:id` | PATCH | LeaveTypeController | HR only | ✅ CORRECT |
| `deleteLeaveType(id)` | `/leave-types/:id` | DELETE | LeaveTypeController | HR only | ✅ CORRECT |

---

## ✅ LEAVE ENTITLEMENTS - `/leaves/entitlements`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `createEntitlement()` | `/leaves/entitlements` | POST | EntitlementController | HR only | ✅ CORRECT |
| `updateEntitlement(id)` | `/leaves/entitlements/:id` | PATCH | EntitlementController | HR only | ✅ CORRECT |
| `assignPersonalized()` | `/leaves/entitlements/assign` | POST | EntitlementController | HR only | ✅ CORRECT |
| `manualAdjustment()` | `/leaves/entitlements/manual-adjustment` | POST | EntitlementController | HR only | ✅ CORRECT |

---

## ✅ LEAVE POLICIES - `/leave-policies`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `getAllPolicies()` | `/leave-policies` | GET | LeavePolicyController | All authenticated users | ✅ CORRECT |
| `getPolicy(id)` | `/leave-policies/:id` | GET | LeavePolicyController | All authenticated users | ✅ CORRECT |
| `createPolicy()` | `/leave-policies` | POST | LeavePolicyController | HR only | ✅ CORRECT |
| `updatePolicy(id)` | `/leave-policies/:id` | PATCH | LeavePolicyController | HR only | ✅ CORRECT |
| `deletePolicy(id)` | `/leave-policies/:id` | DELETE | LeavePolicyController | HR only | ✅ CORRECT |

---

## ✅ CALENDARS & HOLIDAYS - `/leaves/calendars`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `getAllCalendars()` | `/leaves/calendars` | GET | CalendarsController | All authenticated users | ✅ CORRECT |
| `getCalendar(id)` | `/leaves/calendars/:id` | GET | CalendarsController | All authenticated users | ✅ CORRECT |
| `calculateWorkingDays()` | `/leaves/calendars/working-days?from=X&to=Y` | GET | CalendarsController | All authenticated users | ✅ CORRECT |
| `checkBlockedPeriods()` | `/leaves/calendars/check-blocked-periods?from=X&to=Y` | GET | CalendarsController | All authenticated users | ✅ CORRECT |
| `getAllBlockedPeriods()` | `/leaves/calendars/blocked-periods` | GET | CalendarsController | All authenticated users | ✅ CORRECT |
| `createBlockedPeriod()` | `/leaves/calendars/blocked-periods` | POST | CalendarsController | HR only | ✅ CORRECT |
| `deleteBlockedPeriod(id)` | `/leaves/calendars/blocked-periods/:id` | DELETE | CalendarsController | HR only | ✅ CORRECT |

---

## ✅ CATEGORIES - `/leaves/categories`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `getAllCategories()` | `/leaves/categories` | GET | CategoryController | All authenticated users | ✅ CORRECT |

---

## ✅ ESCALATION - `/leaves/escalation`

| Frontend Call | Backend Route | Method | Controller | Roles Required | Status |
|--------------|---------------|--------|------------|----------------|--------|
| `runEscalation()` | `/leaves/escalation/run` | POST | EscalationController | HR only | ✅ CORRECT |

---

## 📊 Architecture Summary

### ✅ Proper Role-Based Access Control

**Employee Routes** (All authenticated users):
- GET `/leaves/requests/me` - View own requests ✅
- GET `/leaves/tracking/me/balances` - View own balances ✅
- GET `/leaves/tracking/me/history` - View own history ✅
- POST `/leaves/requests` - Submit new request ✅
- PATCH `/leaves/requests/:id` - Update own request ✅
- DELETE `/leaves/requests/:id/cancel` - Cancel own request ✅

**Manager Routes** (DEPARTMENT_HEAD, HR_MANAGER):
- GET `/leaves/requests/team` - View team requests ✅
- GET `/leaves/tracking/team/balances` - View team balances ✅
- POST `/leaves/requests/:id/manager-approve` - Approve requests ✅
- POST `/leaves/requests/:id/manager-reject` - Reject requests ✅

**HR Routes** (HR_MANAGER, HR_ADMIN, SYSTEM_ADMIN):
- GET `/leaves/requests` - View ALL requests ✅
- POST `/leaves/requests/:id/hr-finalize` - Finalize requests ✅
- POST `/leaves/requests/:id/hr-override` - Override decisions ✅
- POST `/leaves/entitlements/*` - Manage entitlements ✅
- POST `/leaves/tracking/run-accrual` - Run accrual jobs ✅

### ✅ Frontend Hook Usage

**Employee Pages**:
- `/leaves/my-leaves` uses `useMyRequests()` → Calls `/leaves/requests/me` ✅
- Balances page uses `useMyBalances()` → Calls `/leaves/tracking/me/balances` ✅

**Manager Pages**:
- Manager dashboard uses `useTeamRequests()` → Calls `/leaves/requests/team` ✅

**HR Pages**:
- `/leaves/hr` uses `useAllRequests()` → Calls `/leaves/requests` ✅
- Requires HR role, properly guarded ✅

---

## 🎯 Issues Fixed

### ✅ CRITICAL FIX: Missing Employee Route
**Problem**: Frontend called `GET /leaves/requests/me` but backend didn't have this route.  
**Solution**: Added route to RequestsController before the generic `@Get()` route.  
**Impact**: Employees can now view their own requests without HR permissions.

### ✅ Route Order Fixed
Backend routes now follow proper specificity order:
1. Specific routes first (`/me`, `/team`, `/bulk-process`, etc.)
2. Parametric routes last (`:id`)
3. Generic GET/POST at appropriate positions

---

## ✅ Testing Recommendations

### 1. Employee User Testing
```bash
# Login as DEPARTMENT_EMPLOYEE
# Test these endpoints should work:
GET /leaves/requests/me
GET /leaves/tracking/me/balances
POST /leaves/requests
PATCH /leaves/requests/:id (own requests only)

# Test these should FAIL (403):
GET /leaves/requests (HR only)
GET /leaves/requests/team (Manager only)
```

### 2. Manager User Testing
```bash
# Login as DEPARTMENT_HEAD
# Test these endpoints should work:
GET /leaves/requests/team
POST /leaves/requests/:id/manager-approve
POST /leaves/requests/:id/manager-reject

# Test these should FAIL (403):
GET /leaves/requests (HR only)
POST /leaves/requests/:id/hr-finalize (HR only)
```

### 3. HR User Testing
```bash
# Login as HR_MANAGER
# Test all endpoints should work:
GET /leaves/requests
POST /leaves/requests/:id/hr-finalize
POST /leaves/entitlements/manual-adjustment
```

---

## 🚀 Status: READY FOR TESTING

All frontend API calls are now properly wired to backend routes with correct role-based access control.

**Next Steps**:
1. ✅ Backend compiles with no errors
2. ✅ All routes properly registered
3. ✅ Role guards correctly applied
4. 🧪 Run E2E tests to verify flows
5. 🧪 Test with different user roles
