@echo off
rem One-click people library editor: double-click this file. It opens http://127.0.0.1:5180 in your browser.
rem Edits the files in the library folder; saves keep a .bak copy. Close the window to stop it. Needs Node 20+.
cd /d "%~dp0"
if not exist "node_modules" call npx -y pnpm@9.15.9 install
if errorlevel 1 goto :fail
start "" "http://127.0.0.1:5180/"
call npx -y pnpm@9.15.9 library:edit
if errorlevel 1 goto :fail
exit /b 0

:fail
echo.
echo The editor could not start. Make sure Node.js 20 or newer is installed, then try again.
pause
exit /b 1
