@echo off
echo ========================================
echo AI Workflow Studio E2E Testing Suite
echo ========================================
echo.

echo [INFO] Installing Playwright browsers if needed...
npx playwright install

echo.
echo [INFO] Starting comprehensive E2E tests...
echo [INFO] This will test the enhanced AI Workflow Studio features
echo.

REM Run the E2E tests with detailed reporting
npx playwright test --reporter=html,json,junit

echo.
echo [INFO] Tests completed!
echo [INFO] Opening test report...

REM Open the HTML report
if exist "playwright-report\index.html" (
    start "" "playwright-report\index.html"
) else (
    echo [WARNING] HTML report not found
)

echo.
echo [INFO] Test artifacts saved in:
echo   - playwright-report/ (HTML report)
echo   - test-results/ (screenshots, videos, traces)
echo.

pause
