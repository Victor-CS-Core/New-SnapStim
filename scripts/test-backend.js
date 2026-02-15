/**
 * Backend Connection Test
 * 
 * Quick script to verify the backend is running and accessible.
 * Run with: node scripts/test-backend.js
 */

const API_BASE_URL = 'http://localhost:8787';

async function testBackend() {
  console.log('🔍 Testing backend connection...\n');
  console.log(`Backend URL: ${API_BASE_URL}\n`);

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: HTTP ${healthResponse.status}`);
    }
    
    const healthData = await healthResponse.json();
    console.log(`✅ Health check passed:`, healthData);

    // Test 2: List clients (read-only)
    console.log('\n2️⃣ Testing clients endpoint...');
    const clientsResponse = await fetch(`${API_BASE_URL}/api/client/list?userId=device`);
    
    if (!clientsResponse.ok) {
      throw new Error(`Clients endpoint failed: HTTP ${clientsResponse.status}`);
    }
    
    const clientsData = await clientsResponse.json();
    console.log(`✅ Clients endpoint working:`, {
      ok: clientsData.ok,
      count: clientsData.count,
      hasClients: clientsData.clients?.length > 0
    });

    console.log('\n✨ Backend connection test complete!');
    console.log('🎉 Phase 1 setup is working correctly!\n');

  } catch (error) {
    console.error('\n❌ Backend connection failed:');
    console.error(error.message);
    console.log('\n⚠️  Make sure the backend is running:');
    console.log('   cd C:\\Users\\vitic\\OneDrive\\Documentos\\Development\\Tyler-Project\\SnapStim\\server');
    console.log('   npm run dev\n');
    process.exit(1);
  }
}

testBackend();
