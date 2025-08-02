const fs = require('fs');
const path = require('path');

console.log('🔍 Checking SSL Certificate Status...\n');

// Check for SSL certificates in different locations
const sslLocations = [
  './key.pem',
  './cert.pem',
  '../ssl/key.pem',
  '../ssl/cert.pem',
  './ssl/key.pem',
  './ssl/cert.pem'
];

console.log('📁 Checking SSL certificate locations:');
sslLocations.forEach(location => {
  const fullPath = path.resolve(__dirname, location);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${location} - Found (${stats.size} bytes)`);
  } else {
    console.log(`❌ ${location} - Not found`);
  }
});

console.log('\n🔧 SSL Configuration:');
console.log(`- SSL_KEY_PATH: ${process.env.SSL_KEY_PATH || './key.pem'}`);
console.log(`- SSL_CERT_PATH: ${process.env.SSL_CERT_PATH || './cert.pem'}`);
console.log(`- HTTPS_PORT: ${process.env.HTTPS_PORT || 4443}`);

console.log('\n📋 Next Steps:');
console.log('1. Ensure SSL certificates are in the correct location');
console.log('2. Start backend: npm start');
console.log('3. Start frontend: npm run dev (in FRONTEND directory)');
console.log('4. Access frontend at: https://localhost:5173');
console.log('5. Backend API will be at: https://localhost:4443'); 