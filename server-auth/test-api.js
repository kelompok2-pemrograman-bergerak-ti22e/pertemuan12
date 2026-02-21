#!/usr/bin/env node

/**
 * Test Backend Registration API
 * Jalankan: node test-api.js
 */

const http = require('http');

// Test data
const testData = JSON.stringify({
  username: 'testuser' + Date.now(),
  password: 'password123'
});

console.log('🧪 Testing Backend API...');
console.log('📝 Test data:', JSON.parse(testData));

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length,
  }
};

const req = http.request(options, (res) => {
  let data = '';

  console.log(`📊 Status: ${res.statusCode}`);
  console.log('📋 Headers:', res.headers);

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('✅ Response:', data);
    try {
      console.log('📦 Parsed:', JSON.parse(data));
    } catch (e) {
      console.log('⚠️  Response tidak bisa di-parse sebagai JSON');
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Error:', e.message);
  console.error('⚠️  Pastikan backend server sudah running di port 3000');
});

console.log('📤 Mengirim request ke http://localhost:3000/api/register');
req.write(testData);
req.end();
