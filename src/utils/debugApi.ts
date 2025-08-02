// Debug utility to test API connection from browser
export const debugApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    
    // Test 1: Basic fetch to check if server is reachable
    const basicResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: 'test123'
      })
    });
    
    console.log('📡 Basic fetch response:', {
      status: basicResponse.status,
      statusText: basicResponse.statusText,
      headers: Object.fromEntries(basicResponse.headers.entries())
    });
    
    const basicData = await basicResponse.text();
    console.log('📄 Response body:', basicData);
    
    return {
      success: true,
      status: basicResponse.status,
      data: basicData
    };
    
  } catch (error: any) {
    console.error('❌ API Debug Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message
    };
  }
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).debugApi = debugApiConnection;
}
