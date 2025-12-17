# Leaves Module Testing Guide

## Testing Overview
This guide provides instructions for testing all the enhanced UI components in the Leaves Management module.

## Prerequisites
1. **Database Seeded**: Run the seed script first
   ```bash
   cd backend/src/leaves
   node seed-leaves-data.js
   ```

2. **Backend Running**: Ensure the NestJS backend is running
   ```bash
   cd backend
   npm run start:dev
   ```

3. **Frontend Running**: Ensure the Next.js frontend is running
   ```bash
   cd frontend
   npm run dev
   ```

4. **Authentication**: Log in as a user with HR role (HR Manager, HR Admin, or System Admin)

## Test Cases

### 1. HR Admin Page - Overview Dashboard

#### Test 1.1: Overview Tab Default
**Steps:**
1. Navigate to `/leaves/hr`
2. Verify "Overview" tab is selected by default
3. Check that the overview dashboard is displayed

**Expected Result:**
- Overview tab is active (blue background)
- Dashboard shows three main sections: Recent Activity, Quick Stats, Actions Required

#### Test 1.2: Recent Activity Section
**Steps:**
1. View the "Recent Activity" section on the left side
2. Verify it shows the last 5 leave requests
3. Check each request displays:
   - Employee name (or Employee ID if name not available)
   - Leave type name
   - Start date
   - Status badge with appropriate color

**Expected Result:**
- Maximum 5 requests displayed
- Status colors: Green (Approved), Amber (Pending), Red (Rejected)
- Hovering over items shows hover effect
- Clicking an item opens the request details

#### Test 1.3: Quick Stats Panel
**Steps:**
1. View the "Quick Stats" panel on the right side
2. Check the following metrics:
   - Approval Rate (percentage with progress bar)
   - Pending count (with progress bar)
   - Flagged count (with progress bar)
3. Verify progress bars match the percentages

**Expected Result:**
- All three stats display correctly
- Progress bars visually represent the percentages
- Colors: Blue (approval rate), Amber (pending), Red (flagged)

#### Test 1.4: Actions Required Panel
**Steps:**
1. View the "Actions Required" panel below Quick Stats
2. Click "Pending Review" button
3. Verify it navigates to the Pending tab
4. Go back to Overview
5. Click "Flagged Items" button
6. Verify it shows all requests and filters for flagged items

**Expected Result:**
- Pending Review button shows correct count badge
- Flagged Items button shows correct count badge
- Navigation works correctly
- Filtered views display appropriately

#### Test 1.5: Tab Navigation
**Steps:**
1. From Overview tab, click "All Requests" tab
2. Verify all requests are displayed with filters
3. Click "Pending Review" tab
4. Verify only pending requests are shown
5. Click "System Jobs" tab
6. Verify the RunJobsPanel is displayed
7. Click back to "Overview" tab

**Expected Result:**
- Each tab displays its respective content
- Active tab is highlighted
- Tab transitions are smooth
- No console errors

### 2. Policy Management Page - Enhanced UI

#### Test 2.1: Header Stats Cards
**Steps:**
1. Navigate to `/leaves/policies`
2. View the header section with gradient background
3. Check all four stat cards:
   - Total Leave Types
   - Active Policies
   - Paid Leave Types
   - Require Approval

**Expected Result:**
- All stats display correct numbers (10 types, 7 policies after seeding)
- Cards have glassmorphism effect
- Numbers match actual data in database

#### Test 2.2: HR-Only Buttons Visibility
**Steps:**
1. Logged in as HR user, check header for buttons:
   - "New Leave Type" button (visible)
   - "New Policy" button (visible)
2. Log out and log in as a non-HR user (Employee/Manager)
3. Check if buttons are hidden

**Expected Result:**
- HR users see both creation buttons
- Non-HR users don't see creation buttons
- Role-based access control works correctly

#### Test 2.3: Tab Navigation
**Steps:**
1. Click each tab: Policies, Leave Types, Entitlements, Calendars
2. Verify each tab shows appropriate content
3. Check that selected leave type filter works in Entitlements tab

**Expected Result:**
- Each tab displays correct section component
- Active tab is highlighted
- No content overlap between tabs

### 3. Create Leave Type Modal

#### Test 3.1: Modal Open/Close
**Steps:**
1. On Policies page (as HR user), click "New Leave Type" button
2. Verify modal opens with backdrop blur
3. Click the X close button
4. Verify modal closes
5. Open modal again
6. Click outside modal (on backdrop)
7. Verify modal closes

**Expected Result:**
- Modal opens smoothly
- Backdrop prevents interaction with background
- Modal can be closed via X button or clicking outside

#### Test 3.2: Form Validation
**Steps:**
1. Open Create Leave Type modal
2. Try to submit without filling any fields
3. Verify error message appears
4. Fill only "Code" field
5. Try to submit
6. Verify "Name" is required

**Expected Result:**
- Required fields (Code, Name) show validation errors
- Cannot submit with missing required fields
- Error messages are clear

#### Test 3.3: Code Uppercase Transformation
**Steps:**
1. Open modal
2. Type "vacation" in the Code field
3. Verify it automatically converts to "VACATION"

**Expected Result:**
- Code field value is always uppercase
- Transformation happens on input

#### Test 3.4: Successful Creation
**Steps:**
1. Fill in all fields:
   - Code: COMP_OFF
   - Name: Compensatory Off
   - Description: Time off in lieu of overtime work
   - Max Consecutive Days: 5
   - Min Notice Days: 1
   - Check "Requires Approval"
   - Check "Paid Leave"
2. Click "Create Leave Type"
3. Verify success message
4. Check that modal closes
5. Verify the new leave type appears in the Leave Types tab

**Expected Result:**
- Form submits successfully
- Success message displayed
- Modal closes automatically
- New leave type is added to the list (11th type)
- Data refetches and updates UI

#### Test 3.5: Error Handling
**Steps:**
1. Try to create a leave type with duplicate code (e.g., "ANNUAL")
2. Verify error message from backend is displayed

**Expected Result:**
- Backend validation error is caught
- User-friendly error message displayed
- Modal stays open for correction

### 4. Create Leave Policy Modal

#### Test 4.1: Modal Open/Close
**Steps:**
1. On Policies page (as HR user), click "New Policy" button
2. Verify modal opens
3. Test close button and backdrop click

**Expected Result:**
- Modal opens and closes smoothly
- Same behavior as Leave Type modal

#### Test 4.2: Leave Type Dropdown Population
**Steps:**
1. Open Create Policy modal
2. Click the "Leave Type" dropdown
3. Verify it shows all available leave types (10 seeded types)

**Expected Result:**
- Dropdown is populated from useLeaveTypes hook
- All 10 leave types are listed
- Each option shows leave type name

#### Test 4.3: Conditional Fields - Carryover
**Steps:**
1. In the Carryover section, uncheck "Allow Carryover"
2. Verify "Max Carryover Days" and "Expiry Months" fields are hidden/disabled
3. Check "Allow Carryover"
4. Verify the fields become visible/enabled

**Expected Result:**
- Carryover fields are conditional
- UI updates immediately on toggle
- Values are cleared when disabled

#### Test 4.4: Employee Type Multi-Select
**Steps:**
1. In Eligibility section, view Employee Types buttons
2. Click "PERMANENT" button
3. Verify it becomes highlighted (active state)
4. Click "CONTRACT" button
5. Verify both are selected
6. Click "PERMANENT" again to deselect
7. Verify only "CONTRACT" remains selected

**Expected Result:**
- Multiple employee types can be selected
- Active state shows visual indication
- Clicking again deselects
- At least one should be selected for valid policy

#### Test 4.5: Rounding Rule Options
**Steps:**
1. View the "Rounding Rule" dropdown
2. Check all options are available:
   - NONE
   - ROUND_UP
   - ROUND_DOWN
   - NEAREST_HALF

**Expected Result:**
- All 4 rounding options present
- Default is "NONE"
- Selection works correctly

#### Test 4.6: Successful Policy Creation
**Steps:**
1. Fill in complete policy:
   - Leave Type: Study Leave (or any)
   - Effective Date: Today's date
   - Annual Days: 15
   - Check "Accrued Monthly"
   - Check "Allow Carryover"
   - Max Carryover Days: 5
   - Expiry Months: 6
   - Rounding Rule: NEAREST_HALF
   - Minimum Unit: 0.5
   - Minimum Tenure Months: 6
   - Employee Types: Select PERMANENT and CONTRACT
   - Requires Document Above Days: 3
2. Click "Create Policy"
3. Verify success
4. Check new policy appears in Policies tab

**Expected Result:**
- All form sections save correctly
- Complex nested payload submitted properly
- Success message shown
- Modal closes
- New policy (8th) appears in list
- Data refetches

#### Test 4.7: Date Validation
**Steps:**
1. Try to select an Effective Date in the past
2. (If validation exists) Verify error message

**Expected Result:**
- Date picker validation works
- Future dates preferred for new policies

### 5. Seeded Data Verification

#### Test 5.1: Leave Types List
**Steps:**
1. Navigate to `/leaves/policies`
2. Click "Leave Types" tab
3. Verify all 10 seeded leave types are present:
   - ANNUAL
   - SICK
   - EMERGENCY
   - MATERNITY
   - PATERNITY
   - BEREAVEMENT
   - STUDY
   - UNPAID
   - SABBATICAL
   - RELIGIOUS

**Expected Result:**
- All 10 types displayed
- Each has name, code, description
- Approval/documentation flags visible
- Paid/unpaid indicator shown

#### Test 5.2: Policies List
**Steps:**
1. On Policies page, click "Policies" tab
2. Verify all 7 seeded policies are present
3. Check each policy shows:
   - Associated leave type
   - Entitlement days
   - Effective date
   - Key rules (carryover, rounding, etc.)

**Expected Result:**
- All 7 policies displayed
- Annual Leave: 20 days
- Sick Leave: 12 days (accrued monthly)
- Emergency: 3 days
- Maternity: 120 days
- Paternity: 14 days
- Bereavement: 5 days
- Study Leave: 10 days

#### Test 5.3: Policy-Type Relationships
**Steps:**
1. Filter entitlements by a specific leave type (e.g., ANNUAL)
2. Verify the corresponding policy is shown
3. Test with multiple leave types

**Expected Result:**
- Each policy correctly links to its leave type
- Filtering works properly
- No orphaned policies

### 6. Responsive Design

#### Test 6.1: Desktop View (1920x1080)
**Steps:**
1. View HR Overview page at full screen
2. Verify layout: Recent Activity (2/3 width), Stats + Actions (1/3 width)
3. Check all modals are centered and properly sized

**Expected Result:**
- Three-column grid layout works
- No horizontal scrolling
- All content visible

#### Test 6.2: Tablet View (768px)
**Steps:**
1. Resize browser to tablet width
2. Check that grid stacks vertically
3. Verify modals adapt

**Expected Result:**
- Mobile-first responsive design kicks in
- Components stack properly
- Touch-friendly button sizes

#### Test 6.3: Mobile View (375px)
**Steps:**
1. View on mobile or resize to 375px width
2. Check all buttons are accessible
3. Verify modals are scrollable

**Expected Result:**
- All interactive elements accessible
- Text is readable
- Modals fit within viewport

### 7. API Integration

#### Test 7.1: Data Fetching
**Steps:**
1. Open browser DevTools Network tab
2. Navigate to Policies page
3. Verify API calls:
   - GET `/api/leave-types`
   - GET `/api/leave-policies`
4. Check response status (200 OK)
5. Verify response data matches UI

**Expected Result:**
- All API calls succeed
- Data loads without errors
- Loading states shown during fetch

#### Test 7.2: Mutation Requests
**Steps:**
1. Open DevTools Network tab
2. Create a new leave type via modal
3. Check for POST request to `/api/leave-types`
4. Verify request payload
5. Check response (201 Created)
6. Verify GET request refetches data

**Expected Result:**
- POST request sends correct payload
- Server responds with created resource
- UI updates with new data via refetch

#### Test 7.3: Error Scenarios
**Steps:**
1. Disconnect from network or stop backend
2. Try to create a leave type
3. Verify error message appears
4. Reconnect and retry

**Expected Result:**
- Network errors are caught
- User-friendly error messages
- Retry mechanism works

### 8. Performance

#### Test 8.1: Load Time
**Steps:**
1. Clear browser cache
2. Navigate to `/leaves/hr`
3. Measure time to interactive

**Expected Result:**
- Page loads within 2-3 seconds
- No console errors
- Smooth animations

#### Test 8.2: Large Dataset Handling
**Steps:**
1. If possible, seed 100+ leave requests
2. Navigate to HR page
3. Check if overview still performs well

**Expected Result:**
- Recent Activity shows only 5 (sliced)
- Stats calculations are fast
- No UI lag

### 9. Accessibility

#### Test 9.1: Keyboard Navigation
**Steps:**
1. Use Tab key to navigate through HR page
2. Verify all interactive elements are reachable
3. Press Enter to activate buttons
4. Use Escape key to close modals

**Expected Result:**
- All buttons/links are keyboard accessible
- Tab order is logical
- Escape closes modals
- Focus indicators visible

#### Test 9.2: Screen Reader
**Steps:**
1. Use screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through overview dashboard
3. Check if stats are announced correctly
4. Verify modal labels are read

**Expected Result:**
- All content is accessible
- Labels are descriptive
- ARIA attributes are correct

### 10. Edge Cases

#### Test 10.1: No Leave Requests
**Steps:**
1. Clear all leave requests from database (or use a test account with none)
2. Navigate to HR Overview
3. Verify graceful handling

**Expected Result:**
- Empty state message shown
- No JavaScript errors
- Stats show 0

#### Test 10.2: Invalid Data
**Steps:**
1. Create a leave type with extremely long name (500 characters)
2. Check if UI handles it gracefully

**Expected Result:**
- Text truncates with ellipsis
- No layout breaking
- Scrollable if needed

#### Test 10.3: Concurrent Edits
**Steps:**
1. Open two browser tabs
2. In Tab 1, create a leave type
3. In Tab 2, verify it appears after refresh
4. Test race conditions

**Expected Result:**
- Data stays consistent
- No duplicate entries
- Proper conflict resolution

## Automated Testing

### Unit Tests
```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test
```

### E2E Tests
```bash
# If Cypress/Playwright is set up
cd frontend
npm run test:e2e
```

## Test Data Cleanup

### Reset Database
```bash
# Re-run seed script to reset to known state
cd backend/src/leaves
node seed-leaves-data.js
```

### Manual Cleanup
- Delete test leave types via API: `DELETE /api/leave-types/:id`
- Delete test policies via API: `DELETE /api/leave-policies/:id`

## Reporting Issues

When reporting bugs, include:
1. **Steps to reproduce**
2. **Expected vs actual behavior**
3. **Screenshots** (if UI issue)
4. **Browser & version**
5. **Console errors** (if any)
6. **Network responses** (if API issue)

## Success Criteria

✅ All modals open and close correctly
✅ All forms validate properly
✅ All API calls succeed
✅ Role-based access works
✅ Data displays accurately
✅ Responsive on all screen sizes
✅ No console errors
✅ Builds successfully
✅ Performance is acceptable

## Notes

- Test with different user roles (HR vs Employee)
- Test with browsers: Chrome, Firefox, Safari, Edge
- Test on actual mobile devices if possible
- Monitor console for warnings/errors throughout testing
- Check Network tab for failed requests
- Verify loading states during slow connections

---

**Happy Testing! 🧪**
