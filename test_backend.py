#!/usr/bin/env python3
"""
Test script to verify backend is working
"""

import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("🧪 Testing FlowsyAI Backend...")
    
    # Test health endpoint
    try:
        print("\n1. Testing health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Health endpoint working!")
        else:
            print("❌ Health endpoint failed!")
            
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
    
    # Test root endpoint
    try:
        print("\n2. Testing root endpoint...")
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Root endpoint working!")
        else:
            print("❌ Root endpoint failed!")
            
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test docs endpoint
    try:
        print("\n3. Testing docs endpoint...")
        response = requests.get(f"{base_url}/docs", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Docs endpoint working!")
        else:
            print("❌ Docs endpoint failed!")
            
    except Exception as e:
        print(f"❌ Docs endpoint error: {e}")
    
    # Test API endpoints
    try:
        print("\n4. Testing API endpoints...")
        
        # Test auth endpoints
        response = requests.get(f"{base_url}/api/v1/auth/", timeout=10)
        print(f"Auth endpoint status: {response.status_code}")
        
        # Test workflows endpoints
        response = requests.get(f"{base_url}/api/v1/workflows/", timeout=10)
        print(f"Workflows endpoint status: {response.status_code}")
        
        print("✅ API endpoints accessible!")
        
    except Exception as e:
        print(f"❌ API endpoints error: {e}")

if __name__ == "__main__":
    test_backend()
