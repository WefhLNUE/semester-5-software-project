# Offboarding Module - Functional Requirements & User Guide

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Functional Requirements](#functional-requirements)
4. [How to Access Features](#how-to-access-features)
5. [API Endpoints](#api-endpoints)
6. [MongoDB Connection](#mongodb-connection)

---

## Overview

The Offboarding Module is a comprehensive employee separation management system that handles the entire offboarding process from initial request to final settlement. This module integrates with the recruitment system to provide a complete employee lifecycle management solution.

### Key Features
- **Offboarding Requests**: Create and manage employee offboarding requests
- **Exit Interviews**: Conduct structured exit interviews and collect feedback
- **Asset Management**: Track company assets and their return status
- **Final Settlement**: Calculate and process final payments and settlements
- **Clearance Checklist**: Manage departmental clearances
- **Dashboard & Analytics**: Monitor offboarding metrics and pipeline

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Git

### 1. Clone the Repository

```bash
# If not already cloned, clone the repository
git clone https://github.com/WefhLNUE/semester-5-software-project.git
cd semester-5-software-project

# Initialize and update all submodules
git submodule update --init --recursive
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd frontend
npm install
```

### 3. MongoDB Connection

#### Create Backend .env File
Create a `.env` file in the `backend/` directory with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hr_system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hr_system?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d

# API Configuration
PORT=3001
NODE_ENV=development
```

#### MongoDB Connection Options

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/hr_system`

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Whitelist your IP address
4. Create database user
5. Get connection string from Atlas dashboard
6. Replace in .env file

### 4. Environment Variables for Frontend

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Running the Application

#### Start Backend
```bash
cd backend
npm run start
# OR for development mode with hot reload:
npm run start:dev
```

The backend will run on `http://localhost:3001`

#### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## Functional Requirements

### FR-ONB-001: Offboarding Request Management
**Description**: System shall allow HR managers to create, view, update, and delete offboarding requests

**Fields**:
- Employee ID (Required)
- Reason for offboarding (Required): Resignation, Termination, Retirement, Contract End, Mutual Agreement, Other
- Expected Exit Date (Required)
- Actual Exit Date (Optional)
- Employee Comments (Optional)
- HR Comments (Optional)

**Status Workflow**: Initiated → In Progress → Completed → Cancelled

### FR-ONB-002: Exit Interview Conduct
**Description**: System shall facilitate structured exit interviews with departing employees

**Components**:
- Overall Rating (1-10)
- Department Satisfaction (1-10)
- Management Feedback (1-10)
- Work Environment Rating (1-10)
- Compensation Satisfaction (1-10)
- Reasons for Leaving (Text)
- Suggestions for Improvement (Text)
- General Feedback (Text)
- Would Recommend Company (Yes/No)
- Interviewer Details

### FR-ONB-003: Asset Return Tracking
**Description**: System shall track all company assets assigned to employee and their return status

**Asset Fields**:
- Asset Name (Required)
- Asset Description
- Serial Number
- Asset Category: Electronics, Furniture, Equipment, Vehicle, Other
- Issued Date
- Condition: Good, Fair, Poor, Damaged
- Return Status: Pending, Returned
- Received By (Person ID)
- Notes

### FR-ONB-004: Final Settlement Processing
**Description**: System shall calculate and process final financial settlements

**Settlement Components**:
- Last Working Day
- Final Salary Amount
- Outstanding Leave Balance (days)
- Leave Encashment Amount
- Bonus Amount
- Other Payments
- Deductions
- Net Settlement Amount (auto-calculated)
- Bank Account Details
- Processing Notes
- Payment Date
- Settlement Status: Draft, Pending Approval, Processed, Acknowledged

### FR-ONB-005: Clearance Checklist Management
**Description**: System shall manage departmental clearances before final exit

**Clearance Items**:
- IT Department: System access removal, email deactivation
- Finance: Outstanding payments, expense claims
- HR: Documents return, ID card collection
- Facilities: Desk clearance, parking access
- Direct Manager: Handover completion

### FR-ONB-006: Offboarding Pipeline
**Description**: System shall track offboarding progress through stages

**Stages**:
1. Initial Review
2. Documentation
3. Exit Interview
4. Asset Collection
5. Clearance
6. Final Settlement
7. Completed

### FR-ONB-007: Dashboard & Metrics
**Description**: System shall provide analytics and metrics for offboarding processes

**Metrics**:
- Total Offboarding Requests
- Active Processes
- Completed Processes
- Pending Exit Interviews
- Pending Asset Returns
- Pending Settlements
- Average Process Duration
- Pipeline Stage Distribution

---

## How to Access Features

### Starting Point
1. Open browser and navigate to `http://localhost:3000`
2. Login with appropriate credentials (HR Manager, System Admin, or Department Head)
3. Navigate to **Recruitment** module from main menu
4. Click on **Offboarding Management**

### Feature Access Guide

#### 1. Create Offboarding Request (FR-ONB-001)
**Path**: Recruitment → Offboarding → Offboarding Requests → Create Request

**Steps**:
1. Click "Create Request" or "New Offboarding Request"
2. Fill in Employee ID (MongoDB ObjectId)
3. Select reason for offboarding
4. Set expected exit date
5. Optionally add employee and HR comments
6. Click "Create Offboarding Request"
7. System generates unique offboarding ID

**Navigation**: `/recruitment/offboarding/requests/create`

#### 2. View All Offboarding Requests (FR-ONB-001)
**Path**: Recruitment → Offboarding → Offboarding Requests → All Requests

**Steps**:
1. Click "All Requests"
2. Use search bar to filter by employee ID, reason, or status
3. Click on any request to view details
4. Use action buttons to:
   - View full details
   - Schedule exit interview
   - Track assets
   - Create settlement
   - Delete request (admin only)

**Navigation**: `/recruitment/offboarding/requests/list`

#### 3. Conduct Exit Interview (FR-ONB-002)
**Path**: Recruitment → Offboarding → Exit Interviews → Schedule Interview

**Steps**:
1. From offboarding request, click "Exit Interview" button
2. Fill in satisfaction ratings (1-10 scale)
3. Provide feedback on:
   - Reasons for leaving
   - Suggestions for improvement
   - General feedback
4. Indicate if would recommend company
5. Enter interviewer ID
6. Click "Submit Exit Interview"

**Navigation**: `/recruitment/offboarding/exit-interview/create?requestId=XXX&employeeId=YYY`

#### 4. Track Assets (FR-ONB-003)
**Path**: Recruitment → Offboarding → Asset Management → Asset Tracking

**Steps**:
1. From offboarding request, click "Assets" button
2. Click "+ Add Asset" to add new asset
3. Fill in asset details:
   - Asset name (e.g., "Laptop")
   - Serial number
   - Category
   - Description
4. Click "Add Asset"
5. To mark asset as returned:
   - Click "Mark as Returned" on asset card
   - Enter receiver person ID
   - Confirm action

**Navigation**: `/recruitment/offboarding/assets/tracking?requestId=XXX&employeeId=YYY`

#### 5. Process Final Settlement (FR-ONB-004)
**Path**: Recruitment → Offboarding → Final Settlement → Create Settlement

**Steps**:
1. From offboarding request, click "Settlement" button
2. Enter last working day
3. Fill in payment components:
   - Final salary amount
   - Outstanding leave days
   - Leave encashment amount
   - Bonus amount
   - Other payments
   - Deductions
4. System automatically calculates total settlement
5. Add bank account details
6. Add processing notes
7. Click "Create Settlement"

**Navigation**: `/recruitment/offboarding/settlement/create?requestId=XXX&employeeId=YYY`

#### 6. View Clearance Checklist (FR-ONB-005)
**Path**: Recruitment → Offboarding → Clearance Checklist → View Checklist

**Steps**:
1. Navigate to clearance checklist
2. Enter offboarding request ID
3. View checklist items by department
4. Check off completed items
5. Add notes for each clearance

**Navigation**: `/recruitment/offboarding/clearance/view?requestId=XXX`

#### 7. Monitor Dashboard (FR-ONB-006, FR-ONB-007)
**Path**: Recruitment → Offboarding → Offboarding Pipeline → Dashboard

**Steps**:
1. Click "Dashboard" or "View Dashboard"
2. View key metrics:
   - Total requests
   - Active processes
   - Completed processes
   - Pending items
3. View pipeline stage distribution
4. Access quick actions for common tasks

**Navigation**: `/recruitment/offboarding/dashboard`

#### 8. Track Pipeline Progress (FR-ONB-006)
**Path**: Recruitment → Offboarding → Offboarding Pipeline → Pipeline View

**Steps**:
1. Click "Pipeline View"
2. View all requests grouped by stage
3. Drag and drop to move between stages (if implemented)
4. Click on any request for details

**Navigation**: `/recruitment/offboarding/pipeline`

---

## API Endpoints

### Offboarding Requests
- `POST /offboarding/request` - Create offboarding request
- `GET /offboarding/request` - Get all offboarding requests (with filters)
- `GET /offboarding/request/:id` - Get single offboarding request
- `GET /offboarding/request/employee/:employeeId` - Get requests by employee
- `PUT /offboarding/request/:id` - Update offboarding request
- `DELETE /offboarding/request/:id` - Delete offboarding request

### Offboarding Status
- `POST /offboarding/status/:offboardingRequestId/:employeeId` - Create status
- `GET /offboarding/status/:id` - Get status
- `PUT /offboarding/status/:offboardingRequestId/stage/:stage` - Update stage
- `PUT /offboarding/status/:offboardingRequestId/complete-stage` - Complete current stage

### Exit Interviews
- `POST /offboarding/exit-interview/:offboardingRequestId/:employeeId` - Create exit interview
- `GET /offboarding/exit-interview/:id` - Get exit interview
- `GET /offboarding/exit-interview/offboarding/:offboardingRequestId` - Get by offboarding
- `PUT /offboarding/exit-interview/:id` - Update exit interview
- `PUT /offboarding/exit-interview/:id/complete` - Mark as completed

### Asset Returns
- `POST /offboarding/asset/:offboardingRequestId/:employeeId` - Create asset return
- `GET /offboarding/asset/:id` - Get asset return
- `GET /offboarding/asset/offboarding/:offboardingRequestId` - Get assets by offboarding
- `PUT /offboarding/asset/:id` - Update asset return
- `PUT /offboarding/asset/:id/mark-returned/:receivedByPersonId/:condition` - Mark as returned
- `DELETE /offboarding/asset/:id` - Delete asset return

### Final Settlements
- `POST /offboarding/settlement/:offboardingRequestId/:employeeId` - Create settlement
- `GET /offboarding/settlement/:id` - Get settlement
- `GET /offboarding/settlement/offboarding/:offboardingRequestId` - Get by offboarding
- `PUT /offboarding/settlement/:id` - Update settlement
- `PUT /offboarding/settlement/:id/process/:processedByPersonId` - Process settlement
- `PUT /offboarding/settlement/:id/acknowledge` - Acknowledge settlement

### Clearance Checklist
- `GET /offboarding/clearance/:id` - Get clearance checklist
- `GET /offboarding/clearance/offboarding/:offboardingRequestId` - Get by offboarding

### Dashboard & Metrics
- `GET /offboarding/pipeline?employeeId=XXX` - Get offboarding pipeline
- `GET /offboarding/metrics` - Get offboarding metrics
- `GET /offboarding/progress/:offboardingRequestId` - Get offboarding progress

---

## Testing the Application

### 1. Without MongoDB (UI Only)
The frontend will work without backend connection, but will show:
- Empty states for lists
- Form submission errors
- "Failed to fetch" messages

This allows you to:
- Navigate through all pages
- View UI/UX design
- Test form validations
- Review the user flow

### 2. With MongoDB Connected
Once MongoDB is connected and backend is running:
1. Create a test offboarding request
2. The request will be saved in `terminationrequests` collection
3. Navigate through the workflow:
   - Create request
   - Schedule exit interview
   - Add assets
   - Create settlement
   - View dashboard metrics

### Sample Test Flow
1. Start both backend and frontend
2. Navigate to `/recruitment/offboarding/requests/create`
3. Fill form with test data:
   - Employee ID: Use a valid MongoDB ObjectId from your employee collection
   - Reason: RESIGNATION
   - Expected Exit Date: Tomorrow's date
4. Submit form
5. Navigate to dashboard to see metrics update
6. Access the created request and add exit interview, assets, and settlement

---

## Role-Based Access

### System Admin
- Full access to all offboarding features
- Can delete offboarding requests
- Can access all endpoints

### HR Manager
- Create and manage offboarding requests
- Conduct exit interviews
- Process settlements (with approval)
- View all metrics and reports

### Department Head
- View offboarding requests for their department
- Participate in exit interviews
- Update clearance status
- Limited deletion rights

### Employee
- View their own offboarding status
- Acknowledge final settlement
- Provide exit interview feedback

---

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env` file
- Check if port 3001 is available
- Run `npm install` again

### Frontend shows errors
- Verify backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart dev server
- Check browser console for specific errors

### MongoDB connection failed
- Verify MongoDB service is running
- Check connection string format
- For Atlas: Verify IP whitelist and user credentials
- Test connection using MongoDB Compass

### Authentication errors
- For now, the app uses `'YOUR_AUTH_TOKEN'` placeholder
- In production, implement proper JWT authentication
- Get token from auth context or session storage

---

## Future Enhancements

1. **Email Notifications**: Send automated emails at each stage
2. **Document Generation**: Auto-generate exit documents and clearance forms
3. **Analytics**: Advanced analytics and reports
4. **Integration**: Connect with payroll and HRIS systems
5. **Workflow Automation**: Automatic stage progression based on completions
6. **Mobile App**: Mobile version for on-the-go access

---

## Support

For issues or questions:
1. Check this documentation  
2. Review backend API documentation
3. Check error logs in terminal
4. Review MongoDB collections for data issues

---

## Summary of Routes

| Feature | Route | Functional Requirement |
|---------|-------|----------------------|
| Offboarding Home | `/recruitment/offboarding` | Overview |
| Create Request | `/recruitment/offboarding/requests/create` | FR-ONB-001 |
| View Requests | `/recruitment/offboarding/requests/list` | FR-ONB-001 |
| Request Details | `/recruitment/offboarding/requests/details` | FR-ONB-001 |
| Create Exit Interview | `/recruitment/offboarding/exit-interview/create` | FR-ONB-002 |
| View Exit Interviews | `/recruitment/offboarding/exit-interview/list` | FR-ONB-002 |
| Track Assets | `/recruitment/offboarding/assets/tracking` | FR-ONB-003 |
| Asset Report | `/recruitment/offboarding/assets/report` | FR-ONB-003 |
| Create Settlement | `/recruitment/offboarding/settlement/create` | FR-ONB-004 |
| Process Settlement | `/recruitment/offboarding/settlement/process` | FR-ONB-004 |
| Settlement History | `/recruitment/offboarding/settlement/history` | FR-ONB-004 |
| View Clearance | `/recruitment/offboarding/clearance/view` | FR-ONB-005 |
| Update Clearance | `/recruitment/offboarding/clearance/update` | FR-ONB-005 |
| Dashboard | `/recruitment/offboarding/dashboard` | FR-ONB-006, FR-ONB-007 |
| Pipeline View | `/recruitment/offboarding/pipeline` | FR-ONB-006 |
| Progress Tracker | `/recruitment/offboarding/progress` | FR-ONB-006 |

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Author**: Offboarding Module Development Team
