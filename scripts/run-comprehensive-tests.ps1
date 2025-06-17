# Comprehensive AI Workflow Studio Testing Script
# This script runs all tests and generates a comprehensive report

param(
    [switch]$SkipBuild,
    [switch]$HeadedMode,
    [switch]$DebugMode,
    [string]$Browser = "chromium"
)

Write-Host "🚀 Starting Comprehensive AI Workflow Studio Testing" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Set error action preference
$ErrorActionPreference = "Continue"

# Create test results directory
$TestResultsDir = "test-results"
if (!(Test-Path $TestResultsDir)) {
    New-Item -ItemType Directory -Path $TestResultsDir -Force
}

# Function to log with timestamp
function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

# Function to check if server is running
function Test-ServerRunning {
    param($Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Step 1: Build the application (unless skipped)
if (-not $SkipBuild) {
    Write-Log "📦 Building the application..." "Yellow"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Log "❌ Build failed!" "Red"
        exit 1
    }
    Write-Log "✅ Build completed successfully" "Green"
}

# Step 2: Start the development server
Write-Log "🌐 Starting development server..." "Yellow"
$DevServerJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

# Wait for server to be ready
Write-Log "⏳ Waiting for server to be ready..." "Yellow"
$maxAttempts = 30
$attempt = 0
do {
    Start-Sleep -Seconds 2
    $attempt++
    $serverReady = Test-ServerRunning "http://localhost:8080"
    if ($serverReady) {
        Write-Log "✅ Server is ready!" "Green"
        break
    }
    Write-Log "⏳ Attempt $attempt/$maxAttempts - Server not ready yet..." "Yellow"
} while ($attempt -lt $maxAttempts)

if (-not $serverReady) {
    Write-Log "❌ Server failed to start within timeout!" "Red"
    Stop-Job $DevServerJob -Force
    Remove-Job $DevServerJob -Force
    exit 1
}

# Step 3: Run pre-flight checks
Write-Log "🔍 Running pre-flight checks..." "Yellow"

# Check critical endpoints
$endpoints = @(
    "http://localhost:8080/",
    "http://localhost:8080/ai-workflow-studio/new",
    "http://localhost:8080/dashboard",
    "http://localhost:8080/workflows"
)

$endpointResults = @()
foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint -UseBasicParsing -TimeoutSec 10
        $result = @{
            Endpoint = $endpoint
            Status = $response.StatusCode
            Size = $response.Content.Length
            Success = $true
        }
        Write-Log "✅ $endpoint - Status: $($response.StatusCode)" "Green"
    } catch {
        $result = @{
            Endpoint = $endpoint
            Status = "Error"
            Size = 0
            Success = $false
            Error = $_.Exception.Message
        }
        Write-Log "❌ $endpoint - Error: $($_.Exception.Message)" "Red"
    }
    $endpointResults += $result
}

# Step 4: Run TypeScript type checking
Write-Log "🔧 Running TypeScript type checking..." "Yellow"
npm run type-check
$typeCheckResult = $LASTEXITCODE -eq 0
if ($typeCheckResult) {
    Write-Log "✅ TypeScript type checking passed" "Green"
} else {
    Write-Log "⚠️ TypeScript type checking failed" "Yellow"
}

# Step 5: Run linting
Write-Log "🧹 Running ESLint..." "Yellow"
npm run lint
$lintResult = $LASTEXITCODE -eq 0
if ($lintResult) {
    Write-Log "✅ Linting passed" "Green"
} else {
    Write-Log "⚠️ Linting issues found" "Yellow"
}

# Step 6: Run unit tests
Write-Log "🧪 Running unit tests..." "Yellow"
npm run test:run
$unitTestResult = $LASTEXITCODE -eq 0
if ($unitTestResult) {
    Write-Log "✅ Unit tests passed" "Green"
} else {
    Write-Log "⚠️ Unit tests failed" "Yellow"
}

# Step 7: Run E2E tests
Write-Log "🎭 Running E2E tests..." "Yellow"

$playwrightArgs = @("test")
if ($HeadedMode) { $playwrightArgs += "--headed" }
if ($DebugMode) { $playwrightArgs += "--debug" }
$playwrightArgs += "--project=$Browser"

npx playwright $playwrightArgs
$e2eTestResult = $LASTEXITCODE -eq 0

if ($e2eTestResult) {
    Write-Log "✅ E2E tests passed" "Green"
} else {
    Write-Log "❌ E2E tests failed" "Red"
}

# Step 8: Generate comprehensive report
Write-Log "📊 Generating comprehensive test report..." "Yellow"

$report = @{
    TestRun = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Duration = (Get-Date) - $startTime
        Browser = $Browser
        HeadedMode = $HeadedMode
        DebugMode = $DebugMode
    }
    Results = @{
        Build = if (-not $SkipBuild) { $true } else { "Skipped" }
        ServerStartup = $serverReady
        EndpointChecks = $endpointResults
        TypeCheck = $typeCheckResult
        Linting = $lintResult
        UnitTests = $unitTestResult
        E2ETests = $e2eTestResult
    }
    Summary = @{
        TotalChecks = 6
        PassedChecks = 0
        FailedChecks = 0
        OverallSuccess = $false
    }
}

# Calculate summary
$checks = @($serverReady, $typeCheckResult, $lintResult, $unitTestResult, $e2eTestResult)
$report.Summary.PassedChecks = ($checks | Where-Object { $_ -eq $true }).Count
$report.Summary.FailedChecks = ($checks | Where-Object { $_ -eq $false }).Count
$report.Summary.OverallSuccess = $report.Summary.FailedChecks -eq 0

# Save report to JSON
$reportPath = "$TestResultsDir/comprehensive-test-report.json"
$report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding UTF8

# Display summary
Write-Host "`n📋 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host "Server Startup: $(if($serverReady){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($serverReady){'Green'}else{'Red'})
Write-Host "Type Checking:  $(if($typeCheckResult){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($typeCheckResult){'Green'}else{'Red'})
Write-Host "Linting:        $(if($lintResult){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($lintResult){'Green'}else{'Red'})
Write-Host "Unit Tests:     $(if($unitTestResult){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($unitTestResult){'Green'}else{'Red'})
Write-Host "E2E Tests:      $(if($e2eTestResult){'✅ PASS'}else{'❌ FAIL'})" -ForegroundColor $(if($e2eTestResult){'Green'}else{'Red'})
Write-Host "`nEndpoint Checks:" -ForegroundColor Cyan
foreach ($endpoint in $endpointResults) {
    $status = if($endpoint.Success){'✅ PASS'}else{'❌ FAIL'}
    $color = if($endpoint.Success){'Green'}else{'Red'}
    Write-Host "  $($endpoint.Endpoint): $status" -ForegroundColor $color
}

Write-Host "`n📊 OVERALL RESULT: $(if($report.Summary.OverallSuccess){'✅ ALL TESTS PASSED'}else{'❌ SOME TESTS FAILED'})" -ForegroundColor $(if($report.Summary.OverallSuccess){'Green'}else{'Red'})
Write-Host "📁 Detailed report saved to: $reportPath" -ForegroundColor Blue

# Cleanup
Write-Log "🧹 Cleaning up..." "Yellow"
Stop-Job $DevServerJob -Force
Remove-Job $DevServerJob -Force

# Open test reports if available
if (Test-Path "playwright-report/index.html") {
    Write-Log "🌐 Opening Playwright test report..." "Blue"
    Start-Process "playwright-report/index.html"
}

# Exit with appropriate code
if ($report.Summary.OverallSuccess) {
    Write-Log "🎉 All tests completed successfully!" "Green"
    exit 0
} else {
    Write-Log "⚠️ Some tests failed. Check the reports for details." "Yellow"
    exit 1
}
