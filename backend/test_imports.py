#!/usr/bin/env python3
"""
Test script to check if all imports work correctly
"""

print("Testing imports...")

try:
    print("1. Testing FastAPI...")
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")
except Exception as e:
    print(f"❌ FastAPI import failed: {e}")

try:
    print("2. Testing config...")
    from app.core.config import settings
    print(f"✅ Config imported successfully - Environment: {settings.ENVIRONMENT}")
except Exception as e:
    print(f"❌ Config import failed: {e}")

try:
    print("3. Testing database...")
    from app.core.database import engine, Base
    print("✅ Database imported successfully")
except Exception as e:
    print(f"❌ Database import failed: {e}")

try:
    print("4. Testing logging...")
    from app.core.logging import setup_logging
    print("✅ Logging imported successfully")
except Exception as e:
    print(f"❌ Logging import failed: {e}")

try:
    print("5. Testing API router...")
    from app.api.v1.api import api_router
    print("✅ API router imported successfully")
except Exception as e:
    print(f"❌ API router import failed: {e}")

try:
    print("6. Testing exceptions...")
    from app.core.exceptions import setup_exception_handlers
    print("✅ Exceptions imported successfully")
except Exception as e:
    print(f"❌ Exceptions import failed: {e}")

try:
    print("7. Testing websocket...")
    from app.core.websocket import mount_websocket
    print("✅ WebSocket imported successfully")
except Exception as e:
    print(f"❌ WebSocket import failed: {e}")

print("\nImport test completed!")
