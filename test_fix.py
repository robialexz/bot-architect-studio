#!/usr/bin/env python3
"""
Test rapid după fix
"""

import requests
import time

def test_after_fix():
    print("🔧 TESTARE DUPĂ FIX")
    print("=" * 30)
    
    # Aștept puțin pentru servere să pornească
    print("⏳ Aștept servere să pornească...")
    time.sleep(5)
    
    # Test backend
    try:
        print("\n1. Backend (8000):")
        response = requests.get("http://localhost:8000/health", timeout=3)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Backend OK")
        else:
            print("   ❌ Backend Error")
    except Exception as e:
        print(f"   ❌ Backend Failed: {e}")
    
    # Test frontend
    try:
        print("\n2. Frontend (8080):")
        response = requests.get("http://localhost:8080", timeout=3)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Frontend OK")
        else:
            print("   ❌ Frontend Error")
    except Exception as e:
        print(f"   ❌ Frontend Failed: {e}")
    
    print("\n🎯 NEXT STEPS:")
    print("1. Deschide browser: http://localhost:8080")
    print("2. Verifică console pentru erori")
    print("3. Testează înregistrare")

if __name__ == "__main__":
    test_after_fix()
