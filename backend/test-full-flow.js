const http = require('http');

// Helper to make an HTTP Request
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = body ? JSON.parse(body) : {};
                    resolve({ status: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, body: body });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('🚀 STARTING FULL BACKEND LOGIC TEST\n');

    // Test Data
    const employeeId = "507f1f77bcf86cd799439011"; // Mock ObjectId
    const contractId = "507f1f77bcf86cd799439022"; // Mock ObjectId

    let requestId = null;

    // 1. CREATE REQUEST
    console.log('1️⃣  Testing Create Request...');
    const reqData = {
        employeeId: employeeId,
        initiator: 'employee', // Matches enum
        reason: "Going to Mars",
        expectedExitDate: "2030-01-01"
        // contractId REMOVED to reproduce frontend error
    };

    const createRes = await makeRequest('POST', '/offboarding/request', reqData);
    if (createRes.status === 201) {
        requestId = createRes.body._id;
        console.log(`   ✅ Success! Created Request ID: ${requestId}`);
        console.log(`   Status: ${createRes.body.status}`);
    } else {
        console.log(`   ❌ Failed: ${createRes.status}`);
        console.log('   Error:', createRes.body);
        return; // Stop if create fails
    }

    // 2. CREATE EXIT INTERVIEW
    console.log('\n2️⃣  Testing Exit Interview...');
    const interviewData = {
        ratings: { jobSatisfaction: 5, management: 4 },
        feedback: "Great culture, bad coffee."
    };
    const interviewRes = await makeRequest('POST', `/offboarding/exit-interview/${requestId}/${employeeId}`, interviewData);
    if (interviewRes.status === 201 || interviewRes.status === 200) {
        // Check if comments were updated (as logic stores it in comments)
        if (interviewRes.body.employeeComments && interviewRes.body.employeeComments.includes('[EXIT_INTERVIEW]')) {
            console.log('   ✅ Success! Interview data saved in request comments.');
        } else {
            console.log('   ⚠️ Request succeeded but data might not be stored correctly.');
        }
    } else {
        console.log(`   ❌ Failed: ${interviewRes.status}`);
    }

    // 3. ASSET RETURN
    console.log('\n3️⃣  Testing Asset Return...');
    const assetData = {
        assetId: "507f1f77bcf86cd799439999", // Valid ObjectId
        assetName: "MacBook Pro",
        condition: "Good"
    };
    const assetRes = await makeRequest('POST', `/offboarding/asset/${requestId}/${employeeId}`, assetData);
    if (assetRes.status === 201) {
        console.log('   ✅ Success! Asset checklist created/updated.');
        console.log(`   Items Count: ${assetRes.body.equipmentList ? assetRes.body.equipmentList.length : 0}`);
    } else {
        console.log(`   ❌ Failed: ${assetRes.status}`);
        console.log(assetRes.body);
    }

    // 4. FINAL SETTLEMENT
    console.log('\n4️⃣  Testing Final Settlement...');
    const settlementData = {
        finalSalary: 5000,
        deductions: 200
    };
    const settleRes = await makeRequest('POST', `/offboarding/settlement/${requestId}/${employeeId}`, settlementData);
    if (settleRes.status === 201) {
        if (settleRes.body.hrComments && settleRes.body.hrComments.includes('[SETTLEMENT]')) {
            console.log('   ✅ Success! Settlement data calculated and stored.');
        } else {
            console.log('   ⚠️ Request succeeded but data might not be stored correctly.');
        }
    } else {
        console.log(`   ❌ Failed: ${settleRes.status}`);
    }

    // 5. DASHBOARD METRICS
    console.log('\n5️⃣  Testing Dashboard Metrics...');
    const metricsRes = await makeRequest('GET', '/offboarding/metrics');
    if (metricsRes.status === 200) {
        console.log('   ✅ Success! Retrieved metrics.');
        console.log('   Metrics:', metricsRes.body);
    } else {
        console.log(`   ❌ Failed: ${metricsRes.status}`);
    }

    console.log('\n🏁 TEST COMPLETE');
}

runTests();
