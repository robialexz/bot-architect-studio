# AI Workflow Studio Demo Video Recording Script
# This script automates the complete demo video creation process

param(
    [switch]$FullDemo,
    [switch]$TutorialOnly,
    [switch]$PerformanceOnly,
    [switch]$WithAuth,
    [string]$OutputDir = "demo-video/output"
)

Write-Host "🎬 AI Workflow Studio Demo Video Recording" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Set error action preference
$ErrorActionPreference = "Continue"

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Blue
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

# Step 1: Ensure development server is running
Write-Log "🌐 Checking development server..." "Yellow"
$serverReady = Test-ServerRunning "http://localhost:8080"

if (-not $serverReady) {
    Write-Log "🚀 Starting development server..." "Yellow"
    $DevServerJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        npm run dev
    }

    # Wait for server to be ready
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
        if ($DevServerJob) {
            Stop-Job $DevServerJob -Force
            Remove-Job $DevServerJob -Force
        }
        exit 1
    }
} else {
    Write-Log "✅ Development server is already running!" "Green"
}

# Step 2: Install Playwright if needed
Write-Log "🎭 Ensuring Playwright is ready..." "Yellow"
try {
    npx playwright install chromium
    Write-Log "✅ Playwright browsers ready!" "Green"
} catch {
    Write-Log "❌ Failed to install Playwright browsers!" "Red"
    exit 1
}

# Step 3: Record demo videos based on parameters
Write-Log "🎬 Starting demo recording..." "Yellow"

if ($FullDemo -or (!$TutorialOnly -and !$PerformanceOnly)) {
    Write-Log "📹 Recording complete demo video..." "Blue"

    if ($WithAuth) {
        npx playwright test demo-video/record-demo.spec.ts --grep "Record demo with authentication" --headed
    } else {
        npx playwright test demo-video/record-demo.spec.ts --grep "Record complete demo video" --headed
    }

    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Complete demo recording finished!" "Green"
    } else {
        Write-Log "❌ Complete demo recording failed!" "Red"
    }
}

if ($TutorialOnly) {
    Write-Log "📚 Recording tutorial system showcase..." "Blue"
    npx playwright test demo-video/record-demo.spec.ts --grep "Record tutorial system showcase" --headed

    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Tutorial showcase recording finished!" "Green"
    } else {
        Write-Log "❌ Tutorial showcase recording failed!" "Red"
    }
}

if ($PerformanceOnly) {
    Write-Log "⚡ Recording performance showcase..." "Blue"
    npx playwright test demo-video/record-demo.spec.ts --grep "Record performance and features showcase" --headed

    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Performance showcase recording finished!" "Green"
    } else {
        Write-Log "❌ Performance showcase recording failed!" "Red"
    }
}

# Step 4: Generate subtitles
Write-Log "📝 Generating subtitle files..." "Yellow"
npx playwright test demo-video/record-demo.spec.ts --grep "Generate video metadata" --headed

if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Subtitle files generated!" "Green"
} else {
    Write-Log "⚠️ Subtitle generation had issues" "Yellow"
}

# Step 5: Move video files to output directory
Write-Log "📁 Organizing video files..." "Yellow"

$testResultsDir = "test-results"
if (Test-Path $testResultsDir) {
    $videoFiles = Get-ChildItem -Path $testResultsDir -Recurse -Filter "*.webm" -ErrorAction SilentlyContinue

    foreach ($videoFile in $videoFiles) {
        $newName = "demo-recording-$(Get-Date -Format 'yyyyMMdd-HHmmss').webm"
        $destinationPath = Join-Path $OutputDir $newName

        try {
            Copy-Item $videoFile.FullName $destinationPath -Force
            Write-Log "📹 Video saved: $destinationPath" "Blue"
        } catch {
            Write-Log "⚠️ Failed to copy video: $($videoFile.Name)" "Yellow"
        }
    }

    if ($videoFiles.Count -eq 0) {
        Write-Log "⚠️ No video files found in test results" "Yellow"
    }
} else {
    Write-Log "⚠️ Test results directory not found" "Yellow"
}

# Step 6: Generate video processing instructions
Write-Log "📋 Generating video processing instructions..." "Yellow"

$processingInstructions = @"
# Video Post-Processing Instructions

## Files Generated:
Raw video recordings in: $OutputDir
Subtitle files: demo-video-en.srt, demo-video-ro.srt
Metadata: demo-video-metadata.json

## Video Editing Checklist:

### 1. Video Optimization:
Convert from WebM to MP4 (H.264 codec)
Target bitrate: 5-8 Mbps
Resolution: 1920x1080
Frame rate: 30fps
Target file size: under 50MB

### 2. Audio Enhancement:
Add professional background music (120-130 BPM)
Record professional narration
Audio codec: AAC, 128 kbps
Sync narration with visual cues

### 3. Visual Enhancements:
Add smooth transitions between sections
Include animated overlays for key points
Add call-to-action graphics
Ensure consistent branding

### 4. Subtitles:
Embed English subtitles (demo-video-en.srt)
Embed Romanian subtitles (demo-video-ro.srt)
Font: Arial, 16px, bottom center
Background: Semi-transparent black

### 5. Final Delivery:
Export optimized MP4 for web
Generate thumbnail images
Create multiple quality versions (1080p, 720p, 480p)
Test playback on different devices

## Recommended Tools:
Adobe Premiere Pro / DaVinci Resolve (professional editing)
FFmpeg (command-line optimization)
Handbrake (compression)

## Quality Targets:
Loading time: under 3 seconds on average connection
Compatibility: All modern browsers
Mobile optimization: Responsive design
Accessibility: Full subtitle support

## Deployment:
Upload to CDN for fast global delivery
Implement lazy loading on landing page
Add video analytics tracking
A/B test different versions
"@

$instructionsPath = Join-Path $OutputDir "post-processing-instructions.md"
$processingInstructions | Out-File -FilePath $instructionsPath -Encoding UTF8

Write-Log "📋 Processing instructions saved: $instructionsPath" "Blue"

# Step 7: Generate summary report
Write-Log "📊 Generating summary report..." "Yellow"

$recordingTime = Get-Date
$summary = @{
    RecordingDate = $recordingTime.ToString("yyyy-MM-dd HH:mm:ss")
    Parameters = @{
        FullDemo = $FullDemo
        TutorialOnly = $TutorialOnly
        PerformanceOnly = $PerformanceOnly
        WithAuth = $WithAuth
        OutputDir = $OutputDir
    }
    FilesGenerated = @()
    NextSteps = @(
        "Review recorded videos in $OutputDir",
        "Follow post-processing instructions",
        "Add professional narration and music",
        "Optimize for web delivery",
        "Deploy to landing page"
    )
}

# Add generated files to summary
if (Test-Path $OutputDir) {
    $generatedFiles = Get-ChildItem -Path $OutputDir -File
    $summary.FilesGenerated = $generatedFiles | ForEach-Object { $_.Name }
}

$summaryPath = Join-Path $OutputDir "recording-summary.json"
$summary | ConvertTo-Json -Depth 3 | Out-File -FilePath $summaryPath -Encoding UTF8

# Display final summary
Write-Host "`n📋 RECORDING SUMMARY" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "Recording Date: $($recordingTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor White
Write-Host "Output Directory: $OutputDir" -ForegroundColor White
Write-Host "Files Generated: $($summary.FilesGenerated.Count)" -ForegroundColor White

if ($summary.FilesGenerated.Count -gt 0) {
    Write-Host "`nGenerated Files:" -ForegroundColor Cyan
    foreach ($file in $summary.FilesGenerated) {
        Write-Host "  📁 $file" -ForegroundColor Blue
    }
}

Write-Host "`n🎯 NEXT STEPS:" -ForegroundColor Cyan
foreach ($step in $summary.NextSteps) {
    Write-Host "  • $step" -ForegroundColor Yellow
}

Write-Host "`n🎉 Demo video recording completed successfully!" -ForegroundColor Green
Write-Host "📁 Check the output directory for all generated files." -ForegroundColor Blue
Write-Host "📋 Follow the post-processing instructions for final video production." -ForegroundColor Blue

# Cleanup
if ($DevServerJob) {
    Write-Log "🧹 Cleaning up..." "Yellow"
    Stop-Job $DevServerJob -Force
    Remove-Job $DevServerJob -Force
}

Write-Host "`n✅ All done! Ready for video post-production." -ForegroundColor Green
