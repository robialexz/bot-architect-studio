#!/usr/bin/env python3
"""
Minimal test to check what's causing issues
"""

print("Testing imports...")

try:
    print("1. Testing FastAPI...")
    from fastapi import FastAPI
    app = FastAPI()
    print("✅ FastAPI OK")
except Exception as e:
    print(f"❌ FastAPI error: {e}")

try:
    print("2. Testing config...")
    from app.core.config import settings
    print(f"✅ Config OK - Environment: {settings.ENVIRONMENT}")
except Exception as e:
    print(f"❌ Config error: {e}")

try:
    print("3. Testing database...")
    from app.core.database import engine
    print("✅ Database OK")
except Exception as e:
    print(f"❌ Database error: {e}")

try:
    print("4. Testing auth schemas...")
    from app.schemas.auth import UserRegister
    print("✅ Auth schemas OK")
except Exception as e:
    print(f"❌ Auth schemas error: {e}")

try:
    print("5. Testing user model...")
    from app.models.user import User
    print("✅ User model OK")
except Exception as e:
    print(f"❌ User model error: {e}")

try:
    print("6. Testing security...")
    from app.core.security import get_password_hash
    print("✅ Security OK")
except Exception as e:
    print(f"❌ Security error: {e}")

print("\nAll imports tested!")
