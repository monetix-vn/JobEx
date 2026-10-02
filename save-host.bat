@echo off
rem One-click save host: keeps your worlds in the saves folder so the game can save and continue them.
rem Leave this window open while you play. Close it to stop. Needs Node 20+.
cd /d "%~dp0"
if not exist "node_modules" call npx -y pnpm@9.15.9 install
if errorlevel 1 goto :fail
call npx -y pnpm@9.15.9 save:host
if errorlevel 1 goto :fail
exit /b 0

:fail
echo.
echo The save host could not start. Make sure Node.js 20 or newer is installed, then try again.
pause
exit /b 1
