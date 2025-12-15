const http = require('http');

console.log('🧪 Testing Offboarding API Endpoints...');

const data = JSON.stringify({
    employeeId: "507f1f77bcf86cd799439011", // Valid mongo ID format
    reason: "RESIGNATION",
    expectedExitDate: "2025-12-31"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/offboarding/request',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`\nResponse Status: ${res.statusCode} ${res.statusMessage}`);

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Response Body:', body);

        if (res.statusCode === 404) {
            console.log('\n❌ RESULT: Endpoint NOT FOUND. The controller is not registered!');
            console.log('   Action needed: You MUST register OffboardingController in a Module.');
        } else if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('\n✅ RESULT: Success! The endpoint is working.');
        } else {
            console.log('\n⚠️ RESULT: Endpoint reachable but returned error.');
        }
    });
});

req.on('error', (error) => {
    console.error('\n❌ Connection Error:', error.message);
    console.log('   Is the backend server running on port 5000?');
});

req.write(data);
req.end();
