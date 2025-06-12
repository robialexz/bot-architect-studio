@echo off
echo Uploading FlowsyAI to GitHub...
echo.

echo Step 1: Checking git status...
git status

echo.
echo Step 2: Pushing to GitHub...
git push -u origin main

echo.
echo Upload complete! Check your GitHub repository at:
echo https://github.com/robert-popescu/FlowsyAI

pause
