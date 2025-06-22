#!/usr/bin/env python3
"""
Test simple backend
"""

import requests

try:
    print("Testing simple backend...")
    response = requests.get("http://localhost:8001/health", timeout=5)
    print(f"Health check: {response.status_code}")
    print(f"Response: {response.json()}")
    
    response = requests.post("http://localhost:8001/api/v1/auth/register", timeout=5)
    print(f"Register test: {response.status_code}")
    print(f"Response: {response.json()}")
    
except Exception as e:
    print(f"Error: {e}")
