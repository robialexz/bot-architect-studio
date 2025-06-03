// Simple test script to verify authentication behavior
// Run this in the browser console

console.log('🧪 Starting Authentication Test...');

// Function to check localStorage for auth tokens
function checkAuthStorage() {
  console.log('\n📦 Checking Browser Storage:');

  const authKeys = [];

  // Check localStorage
  console.log('🔍 localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
      authKeys.push({ storage: 'localStorage', key, value: localStorage.getItem(key) });
      console.log(`  - ${key}: ${localStorage.getItem(key)?.substring(0, 50)}...`);
    }
  }

  // Check sessionStorage
  console.log('🔍 sessionStorage:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
      authKeys.push({ storage: 'sessionStorage', key, value: sessionStorage.getItem(key) });
      console.log(`  - ${key}: ${sessionStorage.getItem(key)?.substring(0, 50)}...`);
    }
  }

  if (authKeys.length === 0) {
    console.log('✅ No authentication data found in storage');
  }

  return authKeys;
}

// Function to test current authentication state
async function testAuthState() {
  console.log('\n🔐 Testing Current Auth State:');

  try {
    // Check if we can access the Supabase client
    if (typeof window.supabase === 'undefined') {
      console.log('❌ Supabase client not available in window');
      return;
    }

    const {
      data: { session },
      error,
    } = await window.supabase.auth.getSession();

    if (error) {
      console.log('❌ Error getting session:', error);
      return;
    }

    if (session) {
      console.log('✅ Active session found:');
      console.log(`  - User ID: ${session.user.id}`);
      console.log(`  - Email: ${session.user.email}`);
      console.log(`  - Expires at: ${new Date(session.expires_at * 1000).toLocaleString()}`);
      console.log(`  - Token present: ${!!session.access_token}`);
    } else {
      console.log('❌ No active session');
    }
  } catch (error) {
    console.log('❌ Error testing auth state:', error);
  }
}

// Function to test logout
async function testLogout() {
  console.log('\n🚪 Testing Logout:');

  try {
    if (typeof window.supabase === 'undefined') {
      console.log('❌ Supabase client not available');
      return;
    }

    console.log('📋 Storage before logout:');
    checkAuthStorage();

    console.log('\n🔐 Signing out...');
    const { error } = await window.supabase.auth.signOut();

    if (error) {
      console.log('❌ Logout error:', error);
    } else {
      console.log('✅ Logout successful');
    }

    // Wait a moment for cleanup
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n📋 Storage after logout:');
    checkAuthStorage();

    console.log('\n🔍 Session check after logout:');
    await testAuthState();
  } catch (error) {
    console.log('❌ Error during logout test:', error);
  }
}

// Function to clear all auth data manually
function clearAllAuthData() {
  console.log('\n🧹 Manually clearing all auth data...');

  const keysToRemove = [];

  // Collect localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
      keysToRemove.push({ storage: 'localStorage', key });
    }
  }

  // Collect sessionStorage keys
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
      keysToRemove.push({ storage: 'sessionStorage', key });
    }
  }

  // Remove all keys
  keysToRemove.forEach(({ storage, key }) => {
    if (storage === 'localStorage') {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
    console.log(`🗑️ Removed ${storage} key: ${key}`);
  });

  console.log(`✅ Cleared ${keysToRemove.length} auth-related storage items`);
}

// Main test function
async function runAuthTest() {
  console.log('🧪 === AUTHENTICATION TEST SUITE ===');

  // Initial state check
  await testAuthState();
  checkAuthStorage();

  // If there's an active session, test logout
  try {
    const {
      data: { session },
    } = await window.supabase.auth.getSession();
    if (session) {
      await testLogout();
    } else {
      console.log('\n💡 No active session to test logout with');
      console.log('💡 To test logout: login first, then run testLogout()');
    }
  } catch (error) {
    console.log('❌ Error in main test:', error);
  }

  console.log('\n🧪 === TEST COMPLETE ===');
  console.log('💡 Available functions:');
  console.log('  - testAuthState() - Check current auth state');
  console.log('  - checkAuthStorage() - Check browser storage');
  console.log('  - testLogout() - Test logout functionality');
  console.log('  - clearAllAuthData() - Manually clear all auth data');
}

// Make functions available globally for manual testing
window.testAuthState = testAuthState;
window.checkAuthStorage = checkAuthStorage;
window.testLogout = testLogout;
window.clearAllAuthData = clearAllAuthData;
window.runAuthTest = runAuthTest;

// Auto-run the test
runAuthTest();
