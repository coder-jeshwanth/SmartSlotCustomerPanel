// Test API Connection
// Open browser console and run this to test API connection

const testApiConnection = async () => {
  console.log('🧪 Testing API Connection...');
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/dates/timings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Connection Successful!');
    console.log('📊 Data received:', data);
    
    return data;
  } catch (error) {
    console.error('❌ API Connection Failed:', error);
    console.error('🔍 Error type:', error.name);
    console.error('🔍 Error message:', error.message);
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.log('🚨 This is likely a CORS issue or the server is not running');
    }
    
    throw error;
  }
};

// Run the test
testApiConnection();

// Instructions:
// 1. Open browser console (F12)
// 2. Paste this code and press Enter
// 3. Check the output to see if API connection works