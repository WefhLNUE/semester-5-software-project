# Offboarding Module - Quick Reference

## Quick Start Commands

### 1. Clone & Setup (One-Time)
```bash
# Clone repository
git clone https://github.com/WefhLNUE/semester-5-software-project.git
cd semester-5-software-project

# Initialize submodules
git submodule update --init --recursive

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. MongoDB Setup
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/hr_system
JWT_SECRET=your_secret_key
PORT=3001
```

### 3. Run Application
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev  # Development mode
# OR
npm run start      # Production mode

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Navigate to: Recruitment → Offboarding

---

## Feature Navigation Map

### Main Routes

| Feature | URL | Purpose |
|---------|-----|---------|
| **Home** | `/recruitment/offboarding` | Main offboarding page |
| **Dashboard** | `/recruitment/offboarding/dashboard` | Metrics & analytics |
| **Create Request** | `/recruitment/offboarding/requests/create` | New offboarding |
| **All Requests** | `/recruitment/offboarding/requests/list` | View all requests |
| **Request Details** | `/recruitment/offboarding/requests/details?id=XXX` | Full details |
| **Exit Interview** | `/recruitment/offboarding/exit-interview/create?requestId=XXX&employeeId=YYY` | Conduct interview |
| **Asset Tracking** | `/recruitment/offboarding/assets/tracking?requestId=XXX&employeeId=YYY` | Manage assets |
| **Settlement** | `/recruitment/offboarding/settlement/create?requestId=XXX&employeeId=YYY` | Process payment |
| **Clearance** | `/recruitment/offboarding/clearance/view?requestId=XXX` | Check clearances |
| **Pipeline** | `/recruitment/offboarding/pipeline` | Stage tracking |

---

## User Journey

### Typical Workflow

1. **Start**: Go to `/recruitment/offboarding/requests/create`
2. **Create Request**: Fill employee ID, reason, exit date → Submit
3. **View Dashboard**: Navigate to `/recruitment/offboarding/dashboard`
4. **From Request List**: Click on request card
5. **Complete Tasks**:
   - Click "Exit Interview" → Fill ratings & feedback
   - Click "Assets" → Add & track asset returns
   - Click "Settlement" → Calculate & process payment
   - Click "Clearance" → Complete departmental checks
6. **Monitor Progress**: Dashboard shows completion %

---

## Key Features Implemented

### ✅ Functional Requirements Coverage

| ID | Feature | Status | Pages |
|----|---------|--------|-------|
| FR-ONB-001 | Offboarding Requests | ✅ | create, list, details |
| FR-ONB-002 | Exit Interviews | ✅ | create, list, feedback |
| FR-ONB-003 | Asset Management | ✅ | tracking, return, report |
| FR-ONB-004 | Final Settlement | ✅ | create, process, history |
| FR-ONB-005 | Clearance Checklist | ✅ | view, update |
| FR-ONB-006 | Pipeline Tracking | ✅ | pipeline, progress |
| FR-ONB-007 | Dashboard & Metrics | ✅ | dashboard |

---

## Quick Test Scenario

### Without MongoDB (UI Testing)
1. Start frontend only: `cd frontend && npm run dev`
2. Navigate through pages - UI will work, data won't save
3. Good for testing navigation, forms, styling

### With MongoDB (Full Testing)
1. Start MongoDB: `mongod`
2. Start backend: `cd backend && npm run start:dev`
3. Start frontend: `cd frontend && npm run dev`
4. Create test request:
   - Go to create request page
   - Use any valid MongoDB ObjectId for employee ID
   - Submit form
   - Check dashboard for updated metrics

---

## API Endpoints Summary

### Offboarding Requests
- `POST /offboarding/request` - Create
- `GET /offboarding/request` - List all
- `GET /offboarding/request/:id` - Get one
- `PUT /offboarding/request/:id` - Update
- `DELETE /offboarding/request/:id` - Delete

### Exit Interviews
- `POST /offboarding/exit-interview/:offboardingRequestId/:employeeId`
- `GET /offboarding/exit-interview/offboarding/:offboardingRequestId`
- `PUT /offboarding/exit-interview/:id/complete`

### Assets
- `POST /offboarding/asset/:offboardingRequestId/:employeeId`
- `GET /offboarding/asset/offboarding/:offboardingRequestId`
- `PUT /offboarding/asset/:id/mark-returned/:receivedByPersonId/:condition`

### Settlements
- `POST /offboarding/settlement/:offboardingRequestId/:employeeId`
- `GET /offboarding/settlement/offboarding/:offboardingRequestId`
- `PUT /offboarding/settlement/:id/process/:processedByPersonId`

### Metrics
- `GET /offboarding/metrics` - Dashboard data
- `GET /offboarding/pipeline` - Pipeline stages
- `GET /offboarding/progress/:offboardingRequestId` - Progress %

---

## Styling Consistency

- ✅ Matches recruitment module styling
- ✅ Uses same color scheme (--recruitment variable)
- ✅ Consistent card layouts and hover effects
- ✅ Same navigation patterns
- ✅ Responsive design

---

## Files Created

### Frontend Structure
```
frontend/src/app/recruitment/offboarding/
├── page.tsx                          # Main offboarding page
├── services.ts                       # API service layer
├── dashboard/
│   └── page.tsx                      # Dashboard with metrics
├── requests/
│   ├── create/page.tsx               # Create new request
│   ├── list/page.tsx                 # List all requests
│   └── details/page.tsx              # Request details & actions
├── exit-interview/
│   └── create/page.tsx               # Exit interview form
├── assets/
│   └── tracking/page.tsx             # Asset tracking
└── settlement/
    └── create/page.tsx               # Settlement processing

frontend/
└── OFFBOARDING_GUIDE.md              # Comprehensive documentation
```

---

## Common Issues & Solutions

### Problem: Backend won't start
**Solution**: 
- Check MongoDB is running: `mongod`
- Verify .env file exists in backend/
- Check port 3001 is free

### Problem: "Failed to fetch" errors
**Solution**:
- Ensure backend is running on port 3001
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Verify no CORS issues

### Problem: MongoDB connection failed
**Solution**:
- Local: Start MongoDB service
- Atlas: Check IP whitelist, verify credentials
- Test connection: Use MongoDB Compass

### Problem: Can't see data
**Solution**:
- Create test data through UI
- Check MongoDB collections exist
- Verify API endpoints return data

---

## Next Steps

1. **Connect Real Data**: Replace 'YOUR_AUTH_TOKEN' with actual JWT
2. **Add Authentication**: Implement login/auth context
3. **Test Workflow**: Create full offboarding lifecycle
4. **Customize**: Adjust fields based on requirements
5. **Deploy**: Prepare for production deployment

---

## Support Resources

- **Full Documentation**: See `OFFBOARDING_GUIDE.md`
- **Backend API**: Check `/backend/src/recruitment/offboarding.controller.ts`
- **DTOs**: Review `/backend/src/recruitment/dto/offboarding/`
- **Models**: Check `/backend/src/recruitment/Models/`

---

**Quick Reference Version**: 1.0  
**Last Updated**: December 15, 2025
