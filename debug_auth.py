#!/usr/bin/env python3
"""
Debug script to test auth endpoints
"""

import requests
import json

def test_auth_endpoints():
    base_url = "http://localhost:8000"
    
    print("🔍 Debugging Auth Endpoints...")
    
    # Test if auth endpoint exists
    try:
        print("\n1. Testing auth endpoint availability...")
        response = requests.get(f"{base_url}/api/v1/auth/")
        print(f"Auth root status: {response.status_code}")
        
        # Try to get available endpoints
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("✅ API docs available at /docs")
        
    except Exception as e:
        print(f"❌ Auth endpoint test error: {e}")
    
    # Test registration with detailed error info
    try:
        print("\n2. Testing user registration...")
        user_data = {
            "email": "test@flowsyai.com",
            "password": "testpassword123",
            "full_name": "Test User"
        }
        
        response = requests.post(
            f"{base_url}/api/v1/auth/register", 
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Registration status: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response text: {response.text}")
        
        if response.status_code != 200:
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print("Could not parse error as JSON")
        
    except Exception as e:
        print(f"❌ Registration test error: {e}")
    
    # Test what endpoints are actually available
    try:
        print("\n3. Testing available endpoints...")
        
        endpoints_to_test = [
            "/api/v1/",
            "/api/v1/auth",
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/workflows",
            "/api/v1/users"
        ]
        
        for endpoint in endpoints_to_test:
            try:
                response = requests.get(f"{base_url}{endpoint}")
                print(f"{endpoint}: {response.status_code}")
            except Exception as e:
                print(f"{endpoint}: ERROR - {e}")
                
    except Exception as e:
        print(f"❌ Endpoint test error: {e}")

if __name__ == "__main__":
    test_auth_endpoints()
