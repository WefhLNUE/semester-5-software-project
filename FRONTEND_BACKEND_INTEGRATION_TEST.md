# Frontend-Backend Integration Test Report

## Test Environment
- **Frontend**: http://localhost:3000 ✅ Running
- **Backend**: http://localhost:5000 ✅ Running  
- **Database**: MongoDB `employee-profile-test` ✅ Connected

## Test Plan - Manual UI Testing Required

### Prerequisites
1. Login to the application with appropriate credentials (HR/Manager/Employee)
2. Open Browser Developer Tools (F12) to monitor Network tab

---

## Test 1: Leave Types Management (HR Admin)

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/hr
2. Click on **"+ Create Leave Type"** button
3. Fill in the form:
   - Name: "Test Annual Leave"
   - Code: "TAL"
   - Description: "Test leave type"
   - Check "Is Paid"
   - Icon: Select any icon
   - Check "Requires Medical Certificate" (if needed)
4. Click **"Create Leave Type"**

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows POST to `/leave-types` with status 200/201
- ✅ Leave type appears in the list immediately
- ✅ Refresh page - Leave type persists (confirming DB storage)

### Database Verification Command:
```bash
# In MongoDB shell or Compass:
db.leavetypes.find({ name: "Test Annual Leave" })
```

---

## Test 2: Leave Policy Creation (HR Admin)

### Steps to Test:
1. Stay on http://localhost:3000/leaves/hr
2. Click on **"+ Create Leave Policy"** button
3. Fill in the form sections:
   
   **Basic Info:**
   - Name: "Test Annual Policy 2025"
   - Leave Type: Select "Test Annual Leave" (from Test 1)
   - Year: 2025
   
   **Entitlement:**
   - Total Days: 20
   - Accrual Method: Choose one
   
   **Carryover:**
   - Enable carryover if desired
   - Set max carryover days
   
   **Eligibility:**
   - Set any eligibility rules
   
4. Click **"Create Policy"**

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows POST to `/leave-policies` with status 200/201
- ✅ Policy appears in policies list
- ✅ Refresh page - Policy persists

### Database Verification:
```bash
db.leavepolicies.find({ name: "Test Annual Policy 2025" })
```

---

## Test 3: Leave Request Submission (Employee)

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/my-leaves
2. Click on **"New Request"** or **"Request Leave"** button
3. Fill in the form:
   - Leave Type: Select "Test Annual Leave"
   - Start Date: Tomorrow's date
   - End Date: 3 days from now
   - Reason: "Testing leave request functionality"
   - Upload document (if required)
4. Click **"Submit Request"**

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows:
  - POST to `/leaves/requests` with status 200/201
  - GET to `/leaves/tracking/me/balances` (balance refresh)
  - GET to `/leaves/requests/me` (request list refresh)
- ✅ Request appears in "My Pending Requests" section
- ✅ Leave balance decreases by the requested days
- ✅ Request has status "pending"
- ✅ Refresh page - Request persists

### Database Verification:
```bash
db.leaverequests.find({ reason: "Testing leave request functionality" })
```

---

## Test 4: Manager Approval Workflow (Manager)

### Steps to Test:
1. Login as Manager (or navigate to http://localhost:3000/leaves/team)
2. Find the pending leave request from Test 3
3. Click on the request to view details
4. Click **"Approve"** button
5. Add approval notes if required
6. Confirm approval

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows POST to `/leaves/requests/{id}/manager-approve`
- ✅ Request status changes from "pending" to "approved"
- ✅ Employee's balance is updated
- ✅ Request moves from pending to approved list
- ✅ Refresh page - Status persists

### Database Verification:
```bash
db.leaverequests.find({ _id: ObjectId("request-id") })
# Check: status should be "approved", managerApprovalDate should be set
```

---

## Test 5: HR Finalization (HR Admin)

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/hr
2. Go to "All Requests" or "Pending" tab
3. Find an approved request
4. Click **"Finalize"** button
5. Review integration details
6. Confirm finalization

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows POST to `/leaves/requests/{id}/hr-finalize`
- ✅ Request status changes to "finalized"
- ✅ Integration status updated
- ✅ Request appears in finalized list
- ✅ Refresh page - Status persists

### Database Verification:
```bash
db.leaverequests.find({ status: "finalized" })
```

---

## Test 6: Balance Tracking

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/my-leaves
2. Check "My Leave Balances" section
3. Submit a new leave request (Test 3 steps)
4. Observe balance changes

### Expected Results:
- ✅ Initial balance displays correctly
- ✅ After request submission, balance decreases
- ✅ Network tab shows GET to `/leaves/tracking/me/balances`
- ✅ Balance calculation matches: Initial - Used - Pending = Available
- ✅ Refresh page - Balances persist correctly

### Database Verification:
```bash
db.leaveentitlements.find({ employeeId: ObjectId("employee-id") })
```

---

## Test 7: Manual Balance Adjustment (HR Admin)

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/hr
2. Click **"Manual Adjustment"** button
3. Fill in the form:
   - Employee: Select an employee
   - Leave Type: "Test Annual Leave"
   - Adjustment Type: "Add"
   - Amount: 5 days
   - Reason: "Testing manual adjustment"
4. Click **"Apply Adjustment"**

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows POST to `/leaves/entitlements/manual-adjustment`
- ✅ Employee's balance increases by 5 days
- ✅ Adjustment is logged in audit trail
- ✅ Refresh page - Balance persists

### Database Verification:
```bash
db.leaveentitlements.find({ employeeId: ObjectId("employee-id") })
# Check auditTrail array for the adjustment
```

---

## Test 8: System Jobs (HR Admin)

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/hr
2. Go to "System Jobs" tab
3. Test each job:

   **A. Monthly Accrual:**
   - Click **"Run Accrual"**
   - Confirm action
   
   **B. Year-End Carry Forward:**
   - Click **"Run Carry Forward"**
   - Confirm action
   
   **C. Auto-Escalation:**
   - Click **"Run Escalation"**
   - Confirm action

### Expected Results:
- ✅ Success message for each job
- ✅ Network tab shows POST requests to:
  - `/leaves/tracking/run-accrual`
  - `/leaves/tracking/run-carry-forward`
  - `/leaves/tracking/run-escalation` (if endpoint exists)
- ✅ Jobs execute without errors
- ✅ Database changes reflect job execution

---

## Test 9: Leave Calendar Integration

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/team (Manager view)
2. View the team leave calendar
3. Submit a leave request (as employee)
4. Approve the request (as manager)
5. Check calendar for the approved leave

### Expected Results:
- ✅ Calendar loads with all team members
- ✅ Approved leaves show on calendar
- ✅ Leave dates are highlighted correctly
- ✅ Network tab shows GET to `/leaves/calendars` or similar
- ✅ Calendar updates in real-time after approval

---

## Test 10: Request Cancellation

### Steps to Test:
1. Navigate to http://localhost:3000/leaves/my-leaves
2. Find a pending request
3. Click **"Cancel"** button
4. Confirm cancellation

### Expected Results:
- ✅ Success message appears
- ✅ Network tab shows DELETE to `/leaves/requests/{id}/cancel`
- ✅ Request status changes to "cancelled"
- ✅ Balance is restored (days returned)
- ✅ Request moves to history
- ✅ Refresh page - Status persists

---

## Network Tab Checklist

### For Each Test, Verify:
1. **Request Method**: Correct HTTP verb (GET, POST, PATCH, DELETE)
2. **Endpoint**: Correct API path
3. **Status Code**: 200/201 for success, appropriate error codes for failures
4. **Request Payload**: Data sent matches form inputs
5. **Response Data**: Includes created/updated object with ID
6. **Cookie/Auth**: JWT token or session cookie included

### Example Network Request to Monitor:
```
Request:
POST http://localhost:5000/leaves/requests
Headers:
  Content-Type: application/json
  Cookie: accessToken=<jwt-token>
Body:
{
  "leaveTypeId": "...",
  "dates": { "from": "2025-01-15", "to": "2025-01-17" },
  "reason": "..."
}

Response: 201 Created
{
  "_id": "...",
  "employeeId": "...",
  "leaveTypeId": "...",
  "status": "pending",
  ...
}
```

---

## Database Direct Verification

### Connect to MongoDB:
```bash
# MongoDB Compass or CLI
mongodb://localhost:27017/employee-profile-test
```

### Key Collections to Check:
1. **leavetypes** - Leave type definitions
2. **leavepolicies** - Leave policies
3. **leaverequests** - All leave requests
4. **leaveentitlements** - Employee leave balances
5. **employeeprofiles** - Employee data

### Verification Queries:
```javascript
// Count total leave requests
db.leaverequests.countDocuments()

// Find recent requests
db.leaverequests.find().sort({ createdAt: -1 }).limit(5)

// Check specific employee's balance
db.leaveentitlements.find({ employeeId: ObjectId("employee-id") })

// Verify leave types
db.leavetypes.find({ isActive: true })

// Check audit trails
db.leaveentitlements.find({ "auditTrail.0": { $exists: true } })
```

---

## Common Issues & Troubleshooting

### Issue 1: "Unauthorized" or 401 Errors
**Solution:** Check that you're logged in. Clear cookies and login again.
```javascript
// In browser console:
document.cookie.split(';').forEach(c => console.log(c.trim()))
```

### Issue 2: Network Request Fails
**Solution:** 
- Check backend is running: http://localhost:5000
- Check CORS settings
- Verify API endpoint exists in backend logs

### Issue 3: Data Not Persisting
**Solution:**
- Check MongoDB is running
- Verify database connection in backend logs
- Check for validation errors in Network tab response

### Issue 4: Balance Not Updating
**Solution:**
- Check calculation logic in balance component
- Verify `/leaves/tracking/me/balances` returns updated data
- Check browser console for React query cache issues

---

## Success Criteria Summary

✅ **All tests passed if:**
1. Every UI action triggers correct API call (visible in Network tab)
2. API calls return success status codes (200/201)
3. UI updates immediately after actions
4. Data persists after page refresh
5. Database contains all created/updated records
6. No console errors in browser
7. No server errors in backend logs
8. Balances calculate correctly
9. Status workflows function properly
10. All CRUD operations work for each entity

---

## Test Results Template

After completing all tests, fill in:

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Leave Types Creation | ⬜ Pass / ⬜ Fail |  |
| 2 | Leave Policy Creation | ⬜ Pass / ⬜ Fail |  |
| 3 | Leave Request Submission | ⬜ Pass / ⬜ Fail |  |
| 4 | Manager Approval | ⬜ Pass / ⬜ Fail |  |
| 5 | HR Finalization | ⬜ Pass / ⬜ Fail |  |
| 6 | Balance Tracking | ⬜ Pass / ⬜ Fail |  |
| 7 | Manual Adjustment | ⬜ Pass / ⬜ Fail |  |
| 8 | System Jobs | ⬜ Pass / ⬜ Fail |  |
| 9 | Calendar Integration | ⬜ Pass / ⬜ Fail |  |
| 10 | Request Cancellation | ⬜ Pass / ⬜ Fail |  |

---

## Quick Test Script (Browser Console)

Paste this in browser console while on the app to check API connectivity:

```javascript
// Test API connectivity
fetch('http://localhost:5000/leave-types', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('✅ Leave Types:', data))
.catch(err => console.error('❌ Error:', err));

// Test leave requests endpoint
fetch('http://localhost:5000/leaves/requests/me', {
  credentials: 'include'
})
.then(res => res.json())
.then(data => console.log('✅ My Requests:', data))
.catch(err => console.error('❌ Error:', err));
```

---

**Date Tested:** _________________  
**Tester:** _________________  
**Environment:** Development  
**Overall Status:** ⬜ Pass / ⬜ Fail  
