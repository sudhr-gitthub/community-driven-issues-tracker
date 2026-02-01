async function testBackend() {
  const BASE_URL = 'http://localhost:3000/api';

  console.log('Testing Backend Health...');
  try {
    const health = await fetch(`${BASE_URL}/health`);
    console.log('Health Status:', health.status, await health.json());
  } catch (e) {
    console.error('Health Check Failed:', e.message);
  }

  console.log('\nFetching Issues...');
  try {
    const issues = await fetch(`${BASE_URL}/issues`);
    console.log('Issues Status:', issues.status);
    if (issues.ok) {
        const data = await issues.json();
        console.log('Issues Count:', data.length);
        console.log('First Issue:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('Error Body:', await issues.text());
    }
  } catch (e) {
    console.error('Fetch Issues Failed:', e.message);
  }
}

testBackend();
