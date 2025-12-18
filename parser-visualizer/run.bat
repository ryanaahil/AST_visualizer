@echo off
REM Quick start script for Parser Visualizer on Windows

echo.
echo ======================================
echo   Parser Visualizer - Quick Start
echo ======================================
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "..\..\.venv" (
    echo Setting up Python environment...
    python -m venv "..\..\.venv"
    call "..\..\.venv\Scripts\activate.bat"
    pip install -r ..\requirements.txt
) else (
    call "..\..\.venv\Scripts\activate.bat"
)

echo.
echo Starting Flask development server...
echo.
echo Opening http://localhost:5000 in your browser...
echo Press Ctrl+C to stop the server
echo.

start http://localhost:5000
python app.py

pause
