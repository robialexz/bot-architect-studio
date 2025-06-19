@echo off
echo Starting FlowsyAI deployment to Surge...
echo.

REM Build the application
echo Building application...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.

REM Deploy to Surge
echo Deploying to www.flowsyai.com...
echo.
echo Please enter your Surge credentials when prompted:
echo Email: robialexzi0@gmail.com
echo.

surge dist www.flowsyai.com

echo.
echo Deployment completed!
echo Your site should be live at: https://www.flowsyai.com
pause
