# PowerShell script to package the Modality Analyzer desktop application
# This script creates a portable version of the app without using electron-builder

Write-Host "Packaging Modality Analyzer Desktop Application..." -ForegroundColor Green

# Create output directory
$outputDir = "dist\ModalityAnalyzer-Portable"
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

# Copy application files
Write-Host "Copying application files..." -ForegroundColor Yellow
Copy-Item "index.html" $outputDir
Copy-Item "styles.css" $outputDir
Copy-Item "app.js" $outputDir
Copy-Item "modality-analyzer.js" $outputDir
Copy-Item "nlp-processor.js" $outputDir
Copy-Item "main.js" $outputDir
Copy-Item "package.json" $outputDir

# Copy assets directory if it exists
if (Test-Path "assets") {
    Copy-Item -Recurse "assets" $outputDir
}

# Create a simple launcher script
$launcherContent = @"
@echo off
echo Starting Modality Analyzer...
echo.
echo If you have Node.js installed, you can run:
echo   npm install
echo   npm start
echo.
echo Or double-click the ModalityAnalyzer.exe file if available.
echo.
pause
"@

$launcherContent | Out-File -FilePath "$outputDir\RUN-APPLICATION.bat" -Encoding ASCII

# Create README for the portable version
$readmeContent = @"
# Modality Analyzer - Portable Desktop Application

## How to Run

### Option 1: With Node.js (Recommended)
1. Install Node.js from https://nodejs.org/
2. Open a command prompt in this folder
3. Run: `npm install`
4. Run: `npm start`

### Option 2: Standalone Executable
If a ModalityAnalyzer.exe file is available, double-click it to run.

## Features
- Analyze text for alethic modality (necessity, possibility, impossibility)
- Beautiful desktop interface
- No browser required
- Works offline

## System Requirements
- Windows 10 or later
- Node.js 14+ (for npm start method)
- 100MB free disk space

## Troubleshooting
- If npm start fails, ensure Node.js is installed
- Check that all files are present in this folder
- Try running as administrator if you encounter permission issues
"@

$readmeContent | Out-File -FilePath "$outputDir\README.txt" -Encoding ASCII

# Create a simple installer script
$installerContent = @"
@echo off
echo Installing Modality Analyzer...
echo.

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell -Command "`$WshShell = New-Object -comObject WScript.Shell; `$Shortcut = `$WshShell.CreateShortcut(`"`$env:USERPROFILE\Desktop\Modality Analyzer.lnk`"); `$Shortcut.TargetPath = `"%~dp0ModalityAnalyzer.exe`"; `$Shortcut.WorkingDirectory = `"%~dp0`"; `$Shortcut.Save()"

REM Create start menu shortcut
echo Creating start menu shortcut...
if not exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Modality Analyzer" mkdir "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Modality Analyzer"
powershell -Command "`$WshShell = New-Object -comObject WScript.Shell; `$Shortcut = `$WshShell.CreateShortcut(`"`$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Modality Analyzer\Modality Analyzer.lnk`"); `$Shortcut.TargetPath = `"%~dp0ModalityAnalyzer.exe`"; `$Shortcut.WorkingDirectory = `"%~dp0`"; `$Shortcut.Save()"

echo.
echo Installation complete!
echo You can now run Modality Analyzer from the desktop or start menu.
echo.
pause
"@

$installerContent | Out-File -FilePath "$outputDir\INSTALL.bat" -Encoding ASCII

Write-Host "Packaging complete!" -ForegroundColor Green
Write-Host "Portable application created in: $outputDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "To use the application:" -ForegroundColor Cyan
Write-Host "1. Navigate to the $outputDir folder" -ForegroundColor White
Write-Host "2. Run 'npm install' to install dependencies" -ForegroundColor White
Write-Host "3. Run 'npm start' to launch the application" -ForegroundColor White
Write-Host ""
Write-Host "Or use the RUN-APPLICATION.bat file for guidance" -ForegroundColor White
