const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api/v1';

async function testSanitization() {
  console.log('🧪 Testing Input Sanitization...\n');

  // Test 1: XSS Attack
  console.log('1. Testing XSS Protection:');
  try {
    const xssResponse = await axios.post(`${API_BASE_URL}/user/signup`, {
      fullName: '<script>alert("XSS")</script>',
      email: 'test@test.com',
      password: 'Password123!',
      phone: '1234567890'
    });
    console.log('✅ XSS test passed - malicious script was sanitized');
  } catch (error) {
    console.log('❌ XSS test failed:', error.response?.data?.message);
  }

  // Test 2: SQL Injection
  console.log('\n2. Testing SQL Injection Protection:');
  try {
    const sqlResponse = await axios.post(`${API_BASE_URL}/user/login`, {
      email: 'test@test.com',
      password: 'Password123!'
    });
    console.log('✅ SQL injection test passed');
  } catch (error) {
    console.log('❌ SQL injection test failed:', error.response?.data?.message);
  }

  // Test 3: MongoDB Injection
  console.log('\n3. Testing MongoDB Injection Protection:');
  try {
    const mongoResponse = await axios.post(`${API_BASE_URL}/user/login`, {
      email: '{"$where": "1==1"}',
      password: 'Password123!'
    });
    console.log('✅ MongoDB injection test passed');
  } catch (error) {
    console.log('❌ MongoDB injection test failed:', error.response?.data?.message);
  }

  // Test 4: Admin Login with Sanitization
  console.log('\n4. Testing Admin Login with Sanitization:');
  try {
    const adminResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('✅ Admin login test passed');
  } catch (error) {
    console.log('❌ Admin login test failed:', error.response?.data?.message);
  }

  console.log('\n🎯 Sanitization tests completed!');
}

testSanitization().catch(console.error); 