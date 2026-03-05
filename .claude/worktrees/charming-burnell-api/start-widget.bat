@echo off
:: ─────────────────────────────────────────────────────────────────
::  AI Widget — silent launcher
::  Double-click this file to pin the AI toggle button to your screen.
::  Uses pythonw.exe so no console window appears.
:: ─────────────────────────────────────────────────────────────────

set WIDGET=D:\Codes\nihar840.github.io\.claude\worktrees\charming-burnell-api\ai-widget.py

:: Try pythonw.exe first (no console window)
where pythonw.exe >nul 2>&1
if %errorlevel% == 0 (
    start "" pythonw.exe "%WIDGET%"
    exit /b
)

:: Fallback: pythonw next to python.exe
for /f "delims=" %%P in ('where python.exe 2^>nul') do (
    set PYDIR=%%~dpP
    goto :found_python
)

echo ERROR: Python not found in PATH. Please install Python 3.
pause
exit /b 1

:found_python
set PYTHONW=%PYDIR%pythonw.exe
if exist "%PYTHONW%" (
    start "" "%PYTHONW%" "%WIDGET%"
) else (
    :: Last resort: plain python (will briefly show a console)
    start "" python.exe "%WIDGET%"
)
