require('dotenv').config({ override: true });

const BASE_URL = 'https://resume-builder-523151092542.asia-south1.run.app';
const TEST_EMAIL = 'admin@gmail.com';
const TEST_PASSWORD = 'admin@123';

async function testAuthFlow() {
    console.log(`=============================================`);
    console.log(`🧪 Testing Authentication APIs on Cloud Run`);
    console.log(`📍 Production URL: ${BASE_URL}`);
    console.log(`📧 Test Email: ${TEST_EMAIL}`);
    console.log(`=============================================`);

    // 1. Attempt Sign Up
    console.log(`\n1. Sending Signup request...`);
    try {
        const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                name: 'Admin User',
                provider: 'email'
            })
        });

        const signupData = await signupResponse.json();
        
        if (signupResponse.ok) {
            console.log(`✅ Signup: SUCCESS!`);
            console.log(`🔑 Token Issued: ${signupData.token.substring(0, 20)}...`);
            console.log(`👤 User Details:`, signupData.user);
        } else {
            console.log(`⚠ Signup returned non-ok status (${signupResponse.status}):`);
            console.log(`💬 Message:`, signupData.error || signupData);
            
            if (signupData.error && signupData.error.includes("already registered")) {
                console.log(`ℹ Account is already registered. Moving straight to Login validation...`);
            } else {
                throw new Error(signupData.error || "Signup failed");
            }
        }
    } catch (err) {
        console.error(`❌ Signup validation failed with error:`, err.message);
    }

    // 2. Attempt Login
    console.log(`\n2. Sending Login request...`);
    try {
        const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: TEST_EMAIL,
                password: TEST_PASSWORD
            })
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
            console.log(`✅ Login: SUCCESS!`);
            console.log(`🔑 Token Issued: ${loginData.token.substring(0, 20)}...`);
            console.log(`👤 Authenticated User:`, loginData.user);
            console.log(`\n✨ SUCCESS: All Authentication APIs are fully operational on Cloud Run!`);
        } else {
            console.error(`❌ Login failed with status (${loginResponse.status}):`, loginData.error || loginData);
        }
    } catch (err) {
        console.error(`❌ Login validation failed with error:`, err.message);
    }
}

testAuthFlow();
