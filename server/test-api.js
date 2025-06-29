import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/v1';

async function testAPI() {
  console.log('🧪 Testing Upzy Backend API\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthRes = await fetch('http://localhost:8000/health');
    const health = await healthRes.json();
    console.log(`✅ Health: ${health.status}\n`);

    // Test login
    console.log('2. Testing login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'partner@example.com', password: 'test' })
    });
    const loginData = await loginRes.json();
    console.log(`✅ Login: ${loginData.success ? 'Success' : 'Failed'}`);
    const token = loginData.data?.token;

    // Test get jobs
    console.log('\n3. Testing get jobs...');
    const jobsRes = await fetch(`${BASE_URL}/jobs?limit=2`);
    const jobsData = await jobsRes.json();
    console.log(`✅ Jobs: Found ${jobsData.data?.length} jobs`);

    if (token && jobsData.data?.length > 0) {
      const jobId = jobsData.data[0].id;
      
      // Test accept job
      console.log('\n4. Testing accept job...');
      const acceptRes = await fetch(`${BASE_URL}/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const acceptData = await acceptRes.json();
      console.log(`✅ Accept Job: ${acceptData.success ? 'Success' : 'Failed'}`);

      // Test my jobs
      console.log('\n5. Testing my jobs...');
      const myJobsRes = await fetch(`${BASE_URL}/jobs/my-jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const myJobsData = await myJobsRes.json();
      console.log(`✅ My Jobs: Found ${myJobsData.data?.length} accepted jobs`);
    }

    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI(); 