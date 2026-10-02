@echo off
rem One-click play: double-click this file. Opens in your last language (or your browser's).
rem It rebuilds the game from the current content every time (a few seconds), so new jobs and scenes
rem always show up. Use "play.bat fast" to skip the rebuild. Needs Node 20+ from nodejs.org.
cd /d "%~dp0"
set "PAGE=JobEx-play.html"
set "FAST="
if /i "%~1"=="vi" set "PAGE=JobEx-play-vi.html"
if /i "%~1"=="fast" set "FAST=1"
if /i "%~2"=="fast" set "FAST=1"

if not exist "%PAGE%" set "FAST="
if not defined FAST (
  echo Building the game from the current content, please wait...
  if not exist "node_modules" call npx -y pnpm@9.15.9 install
  if errorlevel 1 goto :fail
  call npx -y pnpm@9.15.9 build:play
  if errorlevel 1 goto :fail
)
start "" "%CD%\%PAGE%"
exit /b 0

:fail
echo.
echo Build failed. Make sure Node.js 20 or newer is installed, then try again.
pause
exit /b 1
