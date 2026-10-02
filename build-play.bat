@echo off
rem Rebuilds JobEx-play.html and JobEx-play-vi.html from the current content. Needs Node 20+.
cd /d "%~dp0"
if not exist "node_modules" call npx -y pnpm@9.15.9 install
if errorlevel 1 goto :fail
call npx -y pnpm@9.15.9 build:play
if errorlevel 1 goto :fail
echo.
echo Done: JobEx-play.html and JobEx-play-vi.html are up to date.
pause
exit /b 0

:fail
echo.
echo Build failed. Make sure Node.js 20 or newer is installed, then try again.
pause
exit /b 1
