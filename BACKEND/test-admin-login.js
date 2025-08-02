const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api/v1';

async function testAdminLogin() {
  console.log('🧪 Testing Admin Login Methods...\n');

  // Test 1: Login with username
  console.log('1. Testing Admin Login with Username:');
  try {
    const usernameResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'admin',
      password: 'Admin@1234'
    });
    console.log('✅ Username login successful');
    console.log('Response:', usernameResponse.data);
  } catch (error) {
    console.log('❌ Username login failed:', error.response?.data?.message);
  }

  // Test 2: Login with email
  console.log('\n2. Testing Admin Login with Email:');
  try {
    const emailResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'admin@gadgetghar.com',
      password: 'Admin@1234'
    });
    console.log('✅ Email login successful');
    console.log('Response:', emailResponse.data);
  } catch (error) {
    console.log('❌ Email login failed:', error.response?.data?.message);
  }

  // Test 3: Invalid credentials
  console.log('\n3. Testing Invalid Credentials:');
  try {
    const invalidResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'wrong',
      password: 'wrong'
    });
    console.log('❌ Should have failed but succeeded');
  } catch (error) {
    console.log('✅ Invalid credentials properly rejected');
    console.log('Error message:', error.response?.data?.message);
  }

  console.log('\n🎯 Admin login tests completed!');
}

testAdminLogin().catch(console.error); 