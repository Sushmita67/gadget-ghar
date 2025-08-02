const axios = require('axios');

async function testCORS() {
  console.log('Testing CORS configuration...\n');

  const testOrigins = [
    'https://localhost:5173',  // Should work (HTTPS)
    'https://localhost:3000',  // Should work (HTTPS)
    'https://localhost:4173',  // Should work (HTTPS)
    'http://localhost:8080',   // Should fail
    'https://malicious-site.com', // Should fail
    'https://localhost:4443'   // Should work (same origin HTTPS)
  ];

  for (const origin of testOrigins) {
    try {
      const response = await axios.get('https://localhost:4443', {
        headers: {
          'Origin': origin
        }
      });
      console.log(`✅ ${origin} - Allowed`);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log(`❌ ${origin} - Blocked (Expected)`);
      } else {
        console.log(`❌ ${origin} - Error: ${error.message}`);
      }
    }
  }

  console.log('\nCORS test completed!');
}

testCORS().catch(console.error); 