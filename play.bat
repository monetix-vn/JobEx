@echo off
rem One-click play: double-click this file. English by default; play-vi.bat opens Vietnamese.
rem First run builds JobEx-play.html (needs Node 20+ from nodejs.org); after that it just opens.
cd /d "%~dp0"
set "LANGQ="
if /i "%~1"=="vi" set "LANGQ=?lang=vi"

if not exist "JobEx-play.html" (
  echo Building the game once, please wait...
  if not exist "node_modules" call npx -y pnpm@9.15.9 install
  if errorlevel 1 goto :fail
  call npx -y pnpm@9.15.9 build:play
  if errorlevel 1 goto :fail
)
start "" "file:///%CD:\=/%/JobEx-play.html%LANGQ%"
exit /b 0

:fail
echo.
echo Build failed. Make sure Node.js 20 or newer is installed, then try again.
pause
exit /b 1
