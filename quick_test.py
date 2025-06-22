#!/usr/bin/env python3
"""
Quick test to check backend status
"""

import requests

try:
    print("Testing backend health...")
    response = requests.get("http://localhost:8000/health", timeout=5)
    print(f"Health check: {response.status_code}")
    print(f"Response: {response.json()}")
    
    print("\nTesting registration...")
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    response = requests.post(
        "http://localhost:8000/api/v1/auth/register",
        json=user_data,
        timeout=10
    )
    
    print(f"Registration status: {response.status_code}")
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        print("Registration successful!")
        
except Exception as e:
    print(f"Error: {e}")
