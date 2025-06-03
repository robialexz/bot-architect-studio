# Simple Demo Recording Script
param(
    [switch]$TutorialOnly
)

Write-Host "🎬 AI Workflow Studio Demo Recording" -ForegroundColor Green

# Function to log with timestamp
function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

# Check if server is running
function Test-ServerRunning {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

# Step 1: Check server
Write-Log "🌐 Checking development server..." "Yellow"
$serverReady = Test-ServerRunning

if (-not $serverReady) {
    Write-Log "❌ Development server is not running!" "Red"
    Write-Log "Please start the server with: npm run dev" "Yellow"
    exit 1
} else {
    Write-Log "✅ Development server is running!" "Green"
}

# Step 2: Install Playwright
Write-Log "🎭 Installing Playwright browsers..." "Yellow"
try {
    npx playwright install chromium
    Write-Log "✅ Playwright ready!" "Green"
} catch {
    Write-Log "❌ Failed to install Playwright!" "Red"
    exit 1
}

# Step 3: Record demo
Write-Log "🎬 Starting demo recording..." "Yellow"

if ($TutorialOnly) {
    Write-Log "📚 Recording tutorial showcase..." "Blue"
    npx playwright test demo-video/record-demo.spec.ts --grep "tutorial" --headed
} else {
    Write-Log "📹 Recording complete demo..." "Blue"
    npx playwright test demo-video/record-demo.spec.ts --grep "complete demo" --headed
}

if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Recording completed successfully!" "Green"
} else {
    Write-Log "❌ Recording failed!" "Red"
}

# Step 4: Show results
Write-Log "📁 Checking for generated videos..." "Yellow"

$testResultsDir = "test-results"
if (Test-Path $testResultsDir) {
    $videoFiles = Get-ChildItem -Path $testResultsDir -Recurse -Filter "*.webm" -ErrorAction SilentlyContinue
    
    if ($videoFiles.Count -gt 0) {
        Write-Log "✅ Found $($videoFiles.Count) video file(s):" "Green"
        foreach ($video in $videoFiles) {
            Write-Log "  📹 $($video.FullName)" "Blue"
        }
    } else {
        Write-Log "⚠️ No video files found" "Yellow"
    }
} else {
    Write-Log "⚠️ Test results directory not found" "Yellow"
}

Write-Host "`n🎉 Demo recording process completed!" -ForegroundColor Green
Write-Host "📁 Check test-results/ directory for video files" -ForegroundColor Blue
