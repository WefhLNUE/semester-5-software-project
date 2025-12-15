const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
console.log('Checking for .env file at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    console.log('File content keys:', Object.keys(envConfig));

    // Check specifically for MONGO_URI
    if (envConfig.MONGO_URI) {
        console.log('✅ MONGO_URI is found in file');
        console.log('Value starts with:', envConfig.MONGO_URI.substring(0, 15) + '...');
    } else {
        console.error('❌ MONGO_URI is MISSING in the file');
    }
} else {
    console.error('❌ .env file does NOT exist at expected path');
    // Try looking one level up just in case
    const upOne = path.resolve(__dirname, '..', '.env');
    if (fs.existsSync(upOne)) {
        console.log('⚠️ Found .env one level up at:', upOne);
    } else {
        console.log('❌ No .env found in parent directory either');
    }
}
